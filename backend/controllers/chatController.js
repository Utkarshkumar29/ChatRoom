const experss=require('express')
const asyncHandler=require('express-async-handler')
const Chat=require('../Models/chatModal')
const User=require('../Models/userSchema')
const express = require('express');
const Message = require('../Models/messageModal');

const app = express();

app.use(express.json());

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
  
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },  //user
        { users: { $elemMatch: { $eq: userId } } }, //other user
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
  
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
  
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  }); 

const fetchChats=asyncHandler(async(req,res)=>{
  try {
    Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
    .populate('users',"-password")
    .populate('groupAdmin','-password')
    .populate('latestMessage').
    sort({updatedAt:-1})
    .then(async(results)=>{
      results=await User.populate(results,{  
        path:"latestMessage.sender",
        select:"username pic email",
      })
      res.status(200).send(results)
    })
  } catch (error) {
    console.log(error)
  }
})

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send("Please fill all the fields");
  }

  console.log('Raw users data:', req.body.users);

  try {
    // Assuming req.body.users is already an object/array
    var users = req.body.users;

    if (users.length < 2) {
      return res.status(400).send("Minimum 2 users are required");
    }

    users.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
      description:req.body.description,
      groupPic:req.body.groupPic,
      unSeenMessages: users.map(user => ({
        user: user,   // For each user in the group
        count: 0      // Initialize unseen messages count to 0
      }))
    
    });

    const populateGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).send(populateGroupChat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


const renameGroupChat=asyncHandler(async(req,res)=>{
    const {chatId,chatName,description}=req.body
    let updateChat
    if(description!=null){
      updateChat=await Chat.findByIdAndUpdate(
        chatId,
        {
          description:description,
        },
        {
          new:true,
        }
      )
      .populate('users','-password')
      .populate('groupAdmin','-password')
    }else{
      updateChat=await Chat.findByIdAndUpdate(
        chatId,
        {
          chatName:chatName,
        },
        {
          new:true,
        }
      )
      .populate('users','-password')
      .populate('groupAdmin','-password')
    }

    if(!updateChat){
      res.status(404)
      throw new Error("Chat not found")
    }else{
      res.json(updateChat)
    }
})

const addToGroup=asyncHandler(async(req,res)=>{
  const {chatId,userIds}=req.body
  console.log(userIds)
  try {
      const added=await Chat.findByIdAndUpdate(
        chatId,
        {
          $push:{users:userIds},
        },
        {
          new:true
        }
      )
      .populate('users','-password')
      .populate('groupAdmin','-password')

      if(!added){
        res.status(404)
        throw new Error("Chat not found")
      }else{  
        res.status(200).json(added)
      }

  } catch (error) {
    console.log(error)
  }
})

const removeFromGroup=asyncHandler(async(req,res)=>{
  const {chatId,userId}=req.body
  try {
    const remove=await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull:{users:userId},
      },
      {
        new:true
      }
    )
    .populate('users','-password')
    .populate('groupAdmin','-password')
    if(!remove){
      res.status(404)
      throw new Error("Chat not found")
    }else{
      res.json(remove)
    }
  } catch (error) {
    console.log(error)
  }
})

const deleteGroup=asyncHandler(async(req,res)=>{
  const {chatId}=req.params
  console.log(chatId)
  try {
      const response=await Chat.findByIdAndDelete(chatId)
      if (response) {
        res.status(200).send({ message: "Group Deleted", chatId });
      } else {
        res.status(404).send({ message: "Group not found", chatId });
      }
  } catch (error) {
      console.log(error)
  }
})

module.exports={accessChat,fetchChats,createGroupChat,renameGroupChat,addToGroup,removeFromGroup,deleteGroup}