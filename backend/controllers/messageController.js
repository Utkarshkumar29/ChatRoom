const express = require("express");
const asyncHandler = require("express-async-handler");
const Message = require('../Models/messageModal');
const Chat = require("../Models/chatModal");
const User = require("../Models/userSchema");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, link, messageType, replyTo, replyMessage, userId } = req.body;

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    link: link,
    messageType: messageType,
    replyTo: replyTo,
    isDeleted: false,
    isDeletedForEveryOne: false,
    replyMessage: replyMessage,
    isPinned: false,
    isStarred: [],
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("replyMessage", "content sender");
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Update unseen message count for all users except the sender (logged-in user)
    await Chat.findByIdAndUpdate(
      chatId,
      {
        $inc: {
          "unSeenMessages.$[elem].count": 1,  // Increment unseen message count
        }
      },
      {
        arrayFilters: [{ "elem.user": { $ne: userId } }],  // Exclude the logged-in user from the update
        new: true
      }
    );

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(
      chatId, 
      {
        latestMessage: message,
      },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: "Failed to send message", error });
  }
});




const allMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default values for page and limit
  try {
    const totalMessages = await Message.countDocuments({ chat: chatId });
    const messages = await Message.find({ chat: chatId })
      .populate("replyTo", "username pic email")
      .populate("sender", "username pic email")
      .populate("replyMessage", "content")
      .populate("chat")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const totalPages = Math.ceil(totalMessages / limit);
    const response = {
      page_number: parseInt(page),
      results: messages,
      count: totalMessages,
      current_page_number: parseInt(page),
      links: {
        next:
          page < totalPages
            ? `http://localhost:5000/api/message/${chatId}?page=${
                parseInt(page) + 1
              }&limit=${limit}`
            : null,
        previous:
          page > 1
            ? `http://localhost:5000/api/message/${chatId}?page=${
                parseInt(page) - 1
              }&limit=${limit}`
            : null,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve messages" });
  }
});

const editMessage=asyncHandler(async(req,res)=>{
  const {messageId,content}=req.body
  try {
      const message=await Message.findOneAndUpdate(
        {_id:messageId},
        {$set:{
          content:content
        }}
      )
      if(message){
        res.status(200).json({message:"Message updated successfully"})
      }
  } catch (error) {
      console.log(error)
  }
})

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId, deleteMsg, deleteForEveryone } = req.body;
  try {
    const message = await Message.findOneAndUpdate(
      { _id: messageId }, // Find by message ID
      {
        $set: {
          isDeleted: deleteMsg,
          isDeletedForEveryOne: deleteForEveryone,
        },
      }, // Update either `isDeleted` or `isDeletedForEveryOne`
      { new: true }
    );
    res.status(200).json({ success: true, message });
  } catch (error) {
    console.log(error);
  }
});

const starMessage = asyncHandler(async (req, res) => {
	const { messageId, isStarred } = req.body;
	const userId = req.user._id;
  
	if (!messageId || !userId) {
	  return res.status(400).json({ success: false, message: "Invalid input data" });
	}
  
	try {
	  const user = await User.findById(userId);
	  let message;
  
	  if (isStarred) {
		message = await Message.findOneAndUpdate(
			{_id: messageId},
			{$pull:{isStarred:user._id}},
			{new:true}
		);
	  } else {
		message = await Message.findOneAndUpdate(
			{_id: messageId},
			{$addToSet:{isStarred:user._id}},
			{new:true}
		);
	  }
  
	  if (!message) {
		return res.status(404).json({ success: false, message: "Message not found" });
	  }
  
	  res.status(200).json({ success: true, message });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  });
  

const getStarredMessage=asyncHandler(async(req,res)=>{
	const userId = req.user._id;
	try {
		const messages=await Message.find({isStarred:userId})		
		res.status(200).json({ success: true, messages });
	} catch (error) {
		console.log(error)
	}
})

const pinMessage=asyncHandler(async(req,res)=>{
  const {messageId,pinStatus}=req.body
  try {
      const message=await Message.findOneAndUpdate(
        {_id:messageId},
        {
          $set:{isPinned:!pinStatus}
        },
        { new: true }
      )
      if(pinStatus==true){
        res.status(200).json({message,isPinned:false});
      }else{
        res.status(200).json({message,isPinned:true});
      }
  } catch (error) {
      console.log(error)
  }
})

const getAllPinnedMessage = asyncHandler(async (req, res) => {
  const {chatId}=req.params
  try {
      const response=await Message.find({chat: chatId, isPinned: true})
      .populate('sender',"username pic email")
      res.status(200).send(response)
      console.log(response)
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Server Error" })
  }
});

const markAsSeen = asyncHandler(async (req, res) => {
  const { messageId, userId, chatId } = req.body;

  try {
    // Step 1: Mark the message as read by the user (add userId to isReadByAll array)
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { isReadByAll: userId } }, // Ensure no duplicate user entries
      { new: true }
    );

    // Step 2: Decrement the unseen message count for the specific user in the chat
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, "unSeenMessages.user": userId, "unSeenMessages.count": { $gt: 0 } }, // Match chat by chatId and ensure unseen count > 0
      {
        $inc: { "unSeenMessages.$.count": -1 } // Decrement the unseen message count for the user
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat or unseen messages not found" });
    }

    // Send response back with the updated message and chat
    res.status(200).send({ message, chat });
    console.log("Updated message:", message);
    console.log("Updated chat:", chat);

  } catch (error) {
    console.error("Error marking message as seen:", error);
    res.status(500).send({ message: "An error occurred" });
  }
});


const groupMedia = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({
      chat: chatId,
      messageType: {$in: ["image/jpeg", "image/png"]}
  })
  .sort({ createdAt: -1 });
    res.status(200).send(messages)
  } catch (error) {
      console.log(error)
  }
});

const groupDocument = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({
      chat: chatId,
      messageType: {$nin: ["image/jpeg", "image/png", "text"]}
  })
  .sort({ createdAt: -1 });
    res.status(200).send(messages)
  } catch (error) {
      console.log(error)
  }
});

module.exports = { sendMessage, allMessage, deleteMessage, starMessage, pinMessage, getAllPinnedMessage, getStarredMessage, editMessage, markAsSeen,groupMedia,groupDocument };
