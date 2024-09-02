import { Link } from "react-router-dom";
import PlusIcon from "../../assets/icons/PlusIcon"; // Ensure path is correct
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import axios from "axios";
import io from "socket.io-client";
import { UserContext } from "../../context/userContext";
import InfiniteScroll from "react-infinite-scroll-component";
import PaperClip from "../../assets/icons/PaperClip";
import { storage } from "../../firebase/auth";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import DownArrow from "../../assets/icons/DownArrow";
import StarIcon from "../../assets/icons/StarIcon";
import EmojiPicker from 'emoji-picker-react';
import FilterIcon from "../../assets/icons/FilterIcon";

const Discussions = () => {
  const [openDiscussionModal, setOpenDiscussionModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupChatRoom, setGroupChatRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessage, setChatMessage] = useState([]);
  const { user, token } = useContext(UserContext);
  const [socketConnected, setSocketConnected] = useState(false);
  const [chatcount, setChatCount] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyToUsername, setReplyToUserName] = useState(null);
  const [pinMessage, setPinMessage] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [deleteForEveryone, setDeleteForEveryone] = useState(false);
  const [starMessage, setStarMessage] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openStarChat,setOpenStarChat]=useState(false)
  const [starredMessages, setStarredMessages] = useState([]);
  const [openEmoji,setOpenEmoji]=useState(false)

  const ENDPOINT = "http://localhost:5000";
  const socket = useRef(null);

  // Setup socket connection and listeners
  useEffect(() => {
    socket.current = io(ENDPOINT, { transports: ["websocket"] });

    socket.current.on("connection", () => {
      setSocketConnected(true);
      console.log("Socket connected:", socket.current.id);
    });

    socket.current.emit("setup", user);
  }, []);

  // Search for users
  const handleSearch = async (keyword) => {
    try {
      const response = await axios.get(`/api/user?search=${keyword}`);
      console.log("User search response:", response.data);
      setUserList(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Create a new discussion room
  const createDiscussionRoom = async (e) => {
    e.preventDefault();
    const data = {
      name: groupName,
      users: users,
    };
    try {
      const response = await axios.post("/api/chats/group", data);
      console.log("Discussion room created:", response.data);
      setOpenDiscussionModal(false); // Close modal after creation
      accessChat(); // Refresh chat list after creating a room
    } catch (error) {
      console.error("Error creating discussion room:", error);
    }
  };

  // Fetch chat groups
  const accessChat = async () => {
    try {
      const response = await axios.get("/api/chats");
      console.log("API response:", response.data); // Log the API response to check data
      const filterGroups = response.data.filter(
        (group) => group.isGroupChat === true
      );
      setGroups(filterGroups);
      console.log("Filtered groups:", filterGroups); // Log filtered groups to ensure correctness
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const handleMessageChange=(e,emoji,groupChatRoom)=>{
    if(e){
      setNewMessage(e.target.value)
      const draftMessage={
        message:e.target.value,
        chatRoom:groupChatRoom
      }
      localStorage.setItem("draft message",draftMessage)
    }else{
      setNewMessage(emoji)
    }
  }

  const [draftMessage,setDraftMessage]=useState([])
  useEffect(() => {
    const savedMessage = localStorage.getItem("draft message");
    if (savedMessage) {
      setNewMessage(savedMessage);
    }
    console.log(savedMessage,'live')
  }, []);

  // Send a new message
  const sendMessage = async () => {
    try {
      const response = await axios.post("/api/message", {
        chatId: groupChatRoom?._id,
        content: newMessage,
        replyTo: replyTo,
      });
      console.log("Message sent response:", response.data);
      setChatMessage((prevMessages) => [...prevMessages, response.data]);
      socket.current.emit("newMessage", response.data);
      setNewMessage("");
      localStorage.removeItem("draft message")
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  // Handle incoming messages
  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      console.log("Message received:", newMessageReceived);
      if (groupChatRoom) {        
        setChatMessage((prevMessages) => {
          return [...prevMessages,
            newMessageReceived];
      });
       
        console.log(newMessageReceived.content, "rain");
      } else {
        console.log("Message received in a different chat.");
      }
    };

    socket.current.on("message received", handleMessageReceived);

    // Clean up listener on component unmount or chatId change
    return () => {
      socket.current.off("message received", handleMessageReceived);
    };
  }, [groupChatRoom]); // Added dependency

  const [nextLink, setNextLink] = useState("");
  // Fetch chat messages
  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `/api/message/${groupChatRoom._id}?page=1&limit=10`
      );
      setChatMessage(response.data.results);
      setChatCount(response.data.count);
      setNextLink(response.data.links.next);
      console.log(response.data.results,'Message received:')
      socket.current.emit("join chat", groupChatRoom._id);
    } catch (error) {
      console.log("Error fetching chat messages:", error);
    }
  };

  console.log(user);

  const fetchMoreChats = async () => {
    try {
      const response = await axios.get(nextLink, {
        withCredentials: true,
      });
      setChatMessage((prevMessages) => [
        ...prevMessages,
        ...response.data.results,
      ]);
      setNextLink(response.data.links.next);
      setHasMoreData(!!response.data.links.next);
    } catch (error) {
      console.error("Error fetching more chat messages:", error);
    }
  };

  useEffect(() => {
    if (groupChatRoom?._id) {
      fetchChats();
    }
  }, [groupChatRoom]);

  useEffect(() => {
    accessChat();
  }, []);

  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setFile(file);
    console.log(file[0]);

    try {
      const storageRef = ref(storage, `files/${file[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("File upload error:", error);
        },
        async () => {
          // Handle successful uploads
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFileUrl(downloadURL);
          console.log("File available at:", downloadURL);

          // Send message with file URL
          const response = await axios.post("/api/message", {
            chatId: groupChatRoom?._id,
            content: null,
            link: downloadURL,
            messageType: "pdf",
          });

          console.log("Message sent response:", response.data);
          setChatMessage((prevMessages) => [...prevMessages, response.data]);
          socket.current.emit("newMessage", response.data);
          setNewMessage("");
        }
      );
    } catch (error) {
      console.error("Error during file upload:", error);
    } finally {
      setFile(null);
    }
  };

  const deleteMessage = async (deleteMsg, deleteForEveryone) => {
    try {
      const response = await axios.put("/api/message", {
        messageId: selectedMessage._id,
        deleteMsg: deleteMsg,
        deleteForEveryone: deleteForEveryone,
      });
      if (deleteMsg) {
        setChatMessage((prevMessages) =>
          prevMessages.map((message) =>
            message._id === selectedMessage._id
              ? { ...message, isDeleted: true }
              : message
          )
        );
      }else if(deleteForEveryone){
        socket.current.emit('messageDeleted',response.data.message)
      }
      setDeleteMsg(false);
      setDeleteForEveryone(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (option) => {
    if (option === "delete") {
      setDeleteMsg(true);
      deleteMessage(true, false); // Passing the values directly
    } else {
      setDeleteForEveryone(true);
      deleteMessage(false, true); // Passing the values directly
    }

    // Reset the state after the deleteMessage call
    setDeleteMsg(false);
    setDeleteForEveryone(false);
  };

  useEffect(() => {
    if (chatMessage?.length < chatcount) {
      setHasMoreData(true);
    } else {
      setHasMoreData(false);
    }
  }, [chatMessage, chatcount]);

  useEffect(()=>{
    const handleMessageDeletedForAll=(messageDeleted)=>{
        console.log(messageDeleted._id ,'fire')
        setChatMessage((prevMessages) => prevMessages.map((message) => message._id === messageDeleted._id ? { ...message, isDeletedForEveryOne: true } : message ));
    }
    socket.current.on('messageDeleted',handleMessageDeletedForAll)
  },[groupChatRoom])

  useEffect(() => {
    console.log(chatMessage ,"fire");
  }, [chatMessage]);


  //star messages======================================================
  const handleStarMessage = async (data,isStarred) => {
    try {
      const response = await axios.put(`/api/message/star`, {
        messageId: data._id,
        userId: user?._id,
        isStarred:isStarred
      });
      if(response.status==200 && isStarred==true){
        setStarredMessages((prev)=> prev.filter((data)=>data._id!==response.data.message._id))
      }else{
        setStarredMessages((prev)=>{
          return [...prev,response.data.message]
        })
      }
    } catch (error) {
      console.log(error,'plant  ');
    }
  };

  const getStarMessage=async()=>{
    try {
        const response=await axios.get(`/api/message/star`)
        console.log(response,'plantss')
        setStarredMessages(response.data.messages)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(()=>{
    getStarMessage()
    console.log(user,'plantss',starredMessages,openStarChat)
  },[openStarChat])

  //pin message===================================
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const getPinnedMessages = async () => {
    console.log("mate");
    try {
      const response = await axios.get(
        `/api/message/pinnedmessages/${groupChatRoom._id}`
      );
      setPinnedMessages(response.data);
    } catch (error) {
      console.log("Error fetching pinned messages", error); // Log errors to debug
    }
  };

  console.log(groupChatRoom, "changed");

  useEffect(() => {
    if(groupChatRoom!=null){
      getPinnedMessages()
    }
  }, [groupChatRoom]);

  const handlePinMessage = async (data) => {
    try {
      const response = await axios.put(`/api/message/pinnedmessages`, {
        messageId: data._id,
        pinStatus: data.isPinned,
      });
      console.log(response, "power1");
      if (response.status == 200) {
        setChatMessage((prevMessages) =>
          prevMessages.map((message) =>
            message._id === data._id
              ? { ...message, isPinned: !data.isPinned }
              : message
          )
        );
        if (response.data.isPinned == true) {
          setPinnedMessages((prev) => {
            return [...prev, response.data.message];
          });
          socket.current.emit("pinMessage", response.data.message);
        } else {
          setPinnedMessages((prev) =>
            prev.filter((message) => message._id !== data._id)
          );
          socket.current.emit("unpinMessage", response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    const handleIncommingPinnedMessage=(newPinMessaege)=>{
      console.log(newPinMessaege,'rain')
      setPinnedMessages((prev) => {
        return [...prev, newPinMessaege];
      });
    }
    socket.current.on('pinned message received',handleIncommingPinnedMessage)

    return () => {
      socket.current.off("pinned message received", handleIncommingPinnedMessage);
    };
  },[groupChatRoom])

  useEffect(()=>{
    const handleIncommingUnPinnedMessage=(newPinMessaege)=>{
      console.log(newPinMessaege,'rain')
      setPinnedMessages((prev) =>
        prev.filter((message) => message._id !== newPinMessaege._id)
      );
    }
    socket.current.on('unpinned message',handleIncommingUnPinnedMessage)

    return () => {
      socket.current.off("unpinned message", handleIncommingUnPinnedMessage);
    };
  },[groupChatRoom])

  useEffect(() => {
    console.log(pinnedMessages, "power");
  }, [pinnedMessages]);

  return (
    <>
      <div className="w-full flex h-screen bg-red-800">
        <div className="h-full flex flex-col items-center gap-[24px] flex-1 bg-teal-400">
          <div>
            <Link to="/chatRoom">Messages</Link>
            <Link to="/discussions">Discussions</Link>
          </div>
          <div>
            <div className="flex">
              <input
                placeholder="Search users"
                onChange={(e) => handleSearch(e.target.value)}
                className="outline-none border border-gray-300 p-2 rounded-md"
              />
              <span
                onClick={() => setOpenDiscussionModal(true)}
                className="ml-2 cursor-pointer"
              >
                <PlusIcon />
              </span>
              <span onClick={()=>{setOpenStarChat(true)}} ><StarIcon/></span>
              <Menu>
                        <MenuButton>
                          <FilterIcon />
                        </MenuButton>
                        <MenuItems anchor="bottom">
                          <div className=" bg-white ">
                            <MenuItem>
                              <p
                                className="block data-[focus]:bg-blue-100"
                              >
                                All Chats
                              </p>
                            </MenuItem>
                            <MenuItem>
                              <p
                                className="block data-[focus]:bg-blue-100"
                                
                              >
                                Unread Chats
                              </p>
                            </MenuItem>
                            <MenuItem>
                              <p
                                className="block data-[focus]:bg-blue-100"
                               
                              >
                                Archived Chats
                              </p>
                            </MenuItem>
                            <MenuItem>
                              <p
                                className="block data-[focus]:bg-blue-100"
                               
                              >
                                Drafts
                              </p>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
            </div>
            <div>
              {groups.map((group, index) => (
                <div key={index}>
                  <p
                    className="hover:bg-orange-400 cursor-pointer p-2 rounded-md flex gap-[12px] "
                    onClick={() => {setGroupChatRoom(group)
                      setOpenStarChat(false)
                    }}
                  >
                    <img src={group.groupAdmin.pic} className=" w-[48px] h-[48px] rounded-full " />
                    <div>
                      <p>{group.chatName}</p>
                      <p>{newMessage ? ` Draft: ${newMessage}` :group.latestMessage.content}</p>
                    </div>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {openStarChat ? (
          <div className="flex flex-col flex-1 bg-green-900 p-[32px]">
            <p>Starred Chats</p>
            <div>
              {starredMessages.map((message,index)=>{
                return(
                  <div className=" bg-yellow-600">
                    <p>{message.content}</p>
                    <span onClick={()=>{handleStarMessage(message,true)}} >Remove</span>
                  </div>
                )
              })}
            </div>
          </div>
        ):(
          <div className="flex flex-1 bg-slate-500 p-[32px]">
          <div className="relative bg-white w-full h-full">
            <div className="font-bold text-xl mb-2">
              {groupChatRoom?.chatName}{" "}
              <span className="  rounded-lg text-sm ">{chatcount}</span>
            </div>
            dd
            {pinnedMessages.map((message, index) => {
              return (
                <div className=" bg-red-500 ">
                  {message.sender.username}
                  {message.content && <p>{message.content}</p>}

                  <p
                    className=" bg-yellow-300 cursor-pointer "
                    onClick={() => {
                      handlePinMessage(message);
                    }}
                  >
                    Unpin
                  </p>
                </div>
              );
            })}
            <InfiniteScroll
              dataLength={chatMessage?.length || 0}
              next={fetchMoreChats}
              hasMore={hasMoreData}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
              className="bg-violet-700"
              height={"80vh"}
            >
              {chatMessage?.map((message, index) => (
                <>
                  <div key={index} className="mb-2">
                    <p>
                      <strong>Sender:</strong> {message.sender.username}
                    </p>

                    <div className=" flex gap-[24px]  ">
                    {!message.isDeleted || !message.isDeletedForEveryOne ? (
                      <p>{message.content}</p>
                    ) : (
                      <p>Message is deleted</p>
                    )}

                      {message.messageType == "pdf" && (
                        <a href={message.link}>PDF</a>
                      )}

                      <Menu>
                        <MenuButton>
                          <DownArrow />
                        </MenuButton>
                        <MenuItems anchor="bottom">
                          <div className=" bg-white ">
                            <MenuItem>
                              <p
                                className="block data-[focus]:bg-blue-100"
                                onClick={() => {
                                  setReplyTo(message.sender._id);
                                  setReplyToUserName(message.sender.username);
                                }}
                              >
                                Reply To
                              </p>
                            </MenuItem>
                            <MenuItem>
                              <p
                                className="block data-[focus]:bg-blue-100"
                                onClick={() => {
                                  handleStarMessage(message,false);
                                }}
                              >
                                Star
                              </p>
                            </MenuItem>
                            <MenuItem>
                              <p
                                className="block data-[focus]:bg-blue-100"
                                onClick={() => {
                                  handlePinMessage(message);
                                }}
                              >
                                Pin
                              </p>
                            </MenuItem>
                            <MenuItem>
                              <p
                                className="block data-[focus]:bg-blue-100"
                                onClick={() => {
                                  setOpenDeleteModal(true);
                                  setSelectedMessage(message);
                                }}
                              >
                                Delete
                              </p>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </div>
                  </div>
                </>
              ))}
            </InfiniteScroll>
            <div className="absolute bottom-0 flex w-full p-2 bg-white border-t border-gray-300">
              {file && <p>{file[0]?.name}</p>}
              <label htmlFor="filePicker" className="cursor-pointer">
                <PaperClip />
              </label>
              <div onClick={()=>{setOpenEmoji(true)}}>
                {openEmoji ? <EmojiPicker onEmojiClick={(emojiObject, event) => {handleMessageChange(false,emojiObject.emoji,groupChatRoom)}} open={openEmoji}/>:<p>o</p>}
              </div>
              <input
                id="filePicker"
                type="file"
                accept=".pdf, .jpeg, .jpg, .png, .gif, .doc, .docx, .txt, .xls, .xlsx, .csv"
                className="hidden" // Hide the file input element
                onChange={(e) => handleFileUpload(e.target.files)} // Handle file upload
              />
              {replyToUsername != null && <p>replying to {replyToUsername}</p>}
              <input
                className="outline-none border border-red-300 w-full p-2 rounded-md"
                value={newMessage}
                onChange={(e) =>handleMessageChange(e,false,groupChatRoom)}
                placeholder="Type a message"
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-500 text-white p-2 rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Discussion Room Modal */}
      <Transition appear show={openDiscussionModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-30 overflow-y-auto"
          onClose={() => setOpenDiscussionModal(false)}
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-lg font-bold">
                Create Discussion Room
              </DialogTitle>
              <div className="mt-2">
                <form onSubmit={createDiscussionRoom}>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Enter Group Name
                    </label>
                    <input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="outline-none border border-gray-300 p-2 rounded-md w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Add Users</label>
                    <input
                      onChange={(e) => handleSearch(e.target.value)}
                      className="outline-none border border-gray-300 p-2 rounded-md w-full"
                    />
                    {userList?.length > 0 && (
                      <select
                        size={Math.min(userList?.length, 5)} // Limit visible options
                        className="border border-gray-300 rounded-md mt-2 w-full"
                        onChange={(e) => {
                          const selectedUser = e.target.value;
                          setUsers((prev) => [...prev, selectedUser]);
                        }}
                      >
                        <option value="">Select a user</option>{" "}
                        {/* Optional placeholder */}
                        {userList.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.username} - {user._id}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      className="py-2 px-4 border border-gray-300 rounded-md"
                      onClick={() => setOpenDiscussionModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-500 text-white rounded-md"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openDeleteModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-30 overflow-y-auto"
          onClose={() => setOpenDeleteModal(false)}
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-lg font-bold">
                Delete Message
              </DialogTitle>
              <div className="mt-2">
                <Description>
                  This will permanently dalate your message
                </Description>
                <div className=" border-t border-[#5758C] flex gap-[24px] ">
                  <button onClick={() => handleDelete("delete")}>
                    Delete for Me
                  </button>
                  { selectedMessage?.sender?._id!=user?._id && <button onClick={() => handleDelete("deleteForAll")}>
                    Delete For Everyone
                  </button>}
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Discussions;
