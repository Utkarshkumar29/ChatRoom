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
import EmojiPicker from "emoji-picker-react";
import FilterIcon from "../../assets/icons/FilterIcon";
import ReadIcon from "../../assets/icons/ReadIcon";
import EmojiIcon from "../../assets/icons/EmojiIcon";
import SearchIcon from "../../assets/icons/SearchIcon";
import DraftMessagesIcon from "../../assets/icons/DraftMessagesIcon";
import ArchiveIcon from "../../assets/icons/ArchiveIcon";
import UnreadMessageIcon from "../../assets/icons/UnreadMessageIcon";
import AllChats from "../../assets/icons/AllChats";
import { formatDistanceToNow } from 'date-fns';


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
  const [openStarChat, setOpenStarChat] = useState(false);
  const [starredMessages, setStarredMessages] = useState([]);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [selectMessage, setSelectMessage] = useState([]);
  const [allowSelect, setAllowSelect] = useState(false);
  const [forward, setForward] = useState(false);
  

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

  const [draftMessage, setDraftMessage] = useState("");
  const [draftMessages, setDraftMessages] = useState([]);
  const [openDraft, setOpenDraft] = useState(false);

  const handleMessageChange = (e, emoji, groupChatRoom) => {
    if (e) {
      const newMessage = e.target.value;
      setNewMessage(newMessage);
      setDraftMessage(newMessage);
      // Retrieve existing drafts from localStorage
      const drafts = JSON.parse(localStorage.getItem("draftMessages")) || {};

      // Update the draft for the current chat room
      drafts[groupChatRoom?._id] = {
        draftMessage,
        groupChatRoom,
      };

      // Save the updated drafts back to localStorage
      localStorage.setItem("draftMessages", JSON.stringify(drafts));
    }else{
      const newMessage = emoji;
      setNewMessage(newMessage);
      setDraftMessage(newMessage);
      // Retrieve existing drafts from localStorage
      const drafts = JSON.parse(localStorage.getItem("draftMessages")) || {};

      // Update the draft for the current chat room
      drafts[groupChatRoom?._id] = {
        draftMessage,
        groupChatRoom,
      };

      // Save the updated drafts back to localStorage
      localStorage.setItem("draftMessages", JSON.stringify(drafts));
    }
  };

  // To retrieve the draft message for a specific chat room
  useEffect(() => {
    const drafts = JSON.parse(localStorage.getItem("draftMessages")) || {};
    if (drafts) {
      setDraftMessages(drafts);
    }
    const draft = Object.values(drafts).find(
      (message) => message?.groupChatRoom?._id == groupChatRoom?._id
    );
    console.log(draft, "fired");
    if (draft) {
      setNewMessage(draft?.draftMessage);
      console.log(draftMessages, "fired");
    } else {
      setNewMessage("");
    }
  }, [groupChatRoom]);

  // Send a new message
  const sendMessage = async () => {
    try {
      if (editMessage) {
        const response = await axios.put("/api/message/edit", {
          messageId: editMessage._id,
          content: newMessage,
        });
        setChatMessage((message) => {
          return message.map((item) =>
            item._id == editMessage._id
              ? { ...item, content: newMessage }
              : item
          );
        });
        setNewMessage("");
        const drafts = JSON.parse(localStorage.getItem("draftMessages")) || {};

        // Remove the specific draft for the current chat room
        delete drafts[groupChatRoom?._id];
        // Save the updated drafts back to localStorage
        localStorage.setItem("draftMessages", JSON.stringify(drafts));
        setDraftMessages((prev) => {
          // Filter out the draft message for the current chat room
          const updatedDrafts = { ...prev };
          delete updatedDrafts[groupChatRoom?._id];
          return updatedDrafts;
        });
      } else {
        const response = await axios.post("/api/message", {
          chatId: groupChatRoom?._id,
          content: newMessage,
          replyTo: replyTo,
          messageType: "text",
          link: null,
        });
        console.log("Message sent response:", response.data);
        setChatMessage((prevMessages) => [...prevMessages, response.data]);
        socket.current.emit("newMessage", response.data);
        setNewMessage("");
        const drafts = JSON.parse(localStorage.getItem("draftMessages")) || {};

        // Remove the specific draft for the current chat room
        delete drafts[groupChatRoom?._id];
        // Save the updated drafts back to localStorage
        localStorage.setItem("draftMessages", JSON.stringify(drafts));
        setDraftMessages((prev) => {
          // Filter out the draft message for the current chat room
          const updatedDrafts = { ...prev };
          delete updatedDrafts[groupChatRoom?._id];
          return updatedDrafts;
        });
      }
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
          return [...prevMessages, newMessageReceived];
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
        `/api/message/${groupChatRoom?._id}?page=1&limit=10`
      );
      setChatMessage(response.data.results);
      setChatCount(response.data.count);
      setNextLink(response.data.links.next);
      console.log(response.data.results, "Message received:");
      socket.current.emit("join chat", groupChatRoom?._id);
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
      const metadata = {
        contentType: "image/png",
      };
      const storageRef = ref(storage, `files/${file[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, file[0], metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("File upload error:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFileUrl(downloadURL);
          console.log("File available at:", downloadURL);

          // Send message with file URL
          const response = await axios.post("/api/message", {
            chatId: groupChatRoom?._id,
            content: null,
            link: downloadURL,
            messageType: file[0].type,
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
        messageId: selectedMessage?._id,
        deleteMsg: deleteMsg,
        deleteForEveryone: deleteForEveryone,
      });
      if (deleteMsg) {
        setChatMessage((prevMessages) =>
          prevMessages.map((message) =>
            message?._id === selectedMessage?._id
              ? { ...message, isDeleted: true }
              : message
          )
        );
      } else if (deleteForEveryone) {
        socket.current.emit("messageDeleted", response.data.message);
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

  useEffect(() => {
    const handleMessageDeletedForAll = (messageDeleted) => {
      setChatMessage((prevMessages) =>
        prevMessages.map((message) =>
          message?._id === messageDeleted?._id
            ? { ...message, isDeletedForEveryOne: true }
            : message
        )
      );
    };
    socket.current.on("messageDeleted", handleMessageDeletedForAll);
  }, [groupChatRoom]);

  useEffect(() => {
    console.log(chatMessage, "fire");
  }, [chatMessage]);

  //star messages======================================================
  const handleStarMessage = async (data, isStarred) => {
    try {
      const response = await axios.put(`/api/message/star`, {
        messageId: data?._id,
        userId: user?._id,
        isStarred: isStarred,
      });
      if (response.status == 200 && isStarred == true) {
        setStarredMessages((prev) =>
          prev.filter((data) => data?._id !== response?.data?.message?._id)
        );
      } else {
        setStarredMessages((prev) => {
          return [...prev, response.data.message];
        });
      }
    } catch (error) {
      console.log(error, "plant  ");
    }
  };

  const getStarMessage = async () => {
    try {
      const response = await axios.get(`/api/message/star`);
      console.log(response, "plantss");
      setStarredMessages(response.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStarMessage();
    console.log(user, "plantss", starredMessages, openStarChat);
  }, [openStarChat]);

  //pin message===================================
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const getPinnedMessages = async () => {
    console.log("mate");
    try {
      const response = await axios.get(
        `/api/message/pinnedmessages/${groupChatRoom?._id}`
      );
      setPinnedMessages(response.data);
    } catch (error) {
      console.log("Error fetching pinned messages", error); // Log errors to debug
    }
  };

  console.log(groupChatRoom, "changed");

  useEffect(() => {
    if (groupChatRoom != null) {
      getPinnedMessages();
    }
  }, [groupChatRoom]);

  const handlePinMessage = async (data) => {
    try {
      const response = await axios.put(`/api/message/pinnedmessages`, {
        messageId: data?._id,
        pinStatus: data.isPinned,
      });
      console.log(response, "power1");
      if (response.status == 200) {
        setChatMessage((prevMessages) =>
          prevMessages.map((message) =>
            message?._id === data?._id
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
            prev.filter((message) => message?._id !== data?._id)
          );
          socket.current.emit("unpinMessage", response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleIncommingPinnedMessage = (newPinMessaege) => {
      console.log(newPinMessaege, "rain");
      setPinnedMessages((prev) => {
        return [...prev, newPinMessaege];
      });
    };
    socket.current.on("pinned message received", handleIncommingPinnedMessage);

    return () => {
      socket.current.off(
        "pinned message received",
        handleIncommingPinnedMessage
      );
    };
  }, [groupChatRoom]);

  useEffect(() => {
    const handleIncommingUnPinnedMessage = (newPinMessaege) => {
      console.log(newPinMessaege, "rain");
      setPinnedMessages((prev) =>
        prev.filter((message) => message?._id !== newPinMessaege?._id)
      );
    };
    socket.current.on("unpinned message", handleIncommingUnPinnedMessage);

    return () => {
      socket.current.off("unpinned message", handleIncommingUnPinnedMessage);
    };
  }, [groupChatRoom]);

  useEffect(() => {
    console.log(selectMessage, "firepower");
  }, [selectMessage]);

  const extractFileName = (url) => {
    // Decode URL components
    const decodedUrl = decodeURIComponent(url);
    console.log(decodedUrl, "decode1231");
    // Split URL by '/' and get the last segment before '?'
    const parts = decodedUrl.split("/");
    console.log(parts, "decode1232");
    const fileNameWithQuery = parts.pop();
    console.log(fileNameWithQuery, "decode1233");
    const fileName = fileNameWithQuery.split("?")[0];
    console.log(fileName, "decode1234");

    return fileName;
  };

  const messageRef=useRef([])
  const seenMessages = useRef(new Set());

  useEffect(()=>{
    const observer= new IntersectionObserver((enteries)=>{
      enteries.forEach((entry)=>{
        if (entry.isIntersecting) {
          const messageId = entry.target.getAttribute('data-id');
          console.log(messageId,'decode1')
          
          // Avoid calling markAsSeen if the message is already seen
          if (!seenMessages.current.has(messageId)) {
            seenMessages.current.add(messageId); // Mark as seen
            markAsSeen(messageId, JSON.parse(localStorage.getItem('user'))?._id);
          }
        }
      })
    })

    messageRef.current.forEach((messageRef)=>{
      if(messageRef){
        observer.observe(messageRef)
      }
    })

    return ()=>{
      messageRef.current.forEach((messageRef)=>{
        if(messageRef){
          observer.unobserve(messageRef)
        }
      })
    }
  },[chatMessage])

  const markAsSeen=async(messageId,userId)=>{
    try {
        const response=await axios.put(`/api/message/seen`,{
          messageId:messageId,
          userId:userId
        })
        setChatMessage((messages) =>
          messages.map((message) =>
            message?._id === response?.data?.message?._id
              ? { ...message, isReadByAll: [...message.isReadByAll, userId] }
              : message
          )
        );
    } catch (error) {
        console.log(error)
    }
  }

  const handleGroupOpen=(group)=>{
    setGroupChatRoom(group);
    setOpenStarChat(false);
  }

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMs = now - createdDate;
  
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);
  
    if (diffInYears > 0) return `${diffInYears}y`;
    if (diffInMonths > 0) return `${diffInMonths}mo`;
    if (diffInDays > 0) return `${diffInDays}d`;
    if (diffInHours > 0) return `${diffInHours}h`;
    if (diffInMinutes > 0) return `${diffInMinutes}m`;
    return ``;
  };

  console.log(groupChatRoom,'decode')
  return (
    <>
      <div className="w-full flex h-screen bg-[#F2F3F5] py-[60px] px-[80px] gap-[32px]  ">
        <div className="h-full flex flex-col items-center gap-[24px] flex-1 max-w-[500px] ">
          <div className=" max-w-[7 00px] bg-[#FFFFFF] w-full flex items-center justify-evenly py-[16px] px-[24px] rounded-2xl border border-[#D7D7D8] gap-[24px] ">
            <Link to="/chatRoom" className="w-full text-[#1660CD] bg-[#FFFFFF] py-[12px] px-[32px] rounded-xl border border-[#1600CD] text-center ">Messages</Link>
            <Link to="/discussions" className="w-full bg-[#1660CD] text-[#FFFFFF] py-[12px] px-[32px] rounded-xl text-center ">Discussions</Link>
          </div>
          <div className=" relative bg-[#FFFFFF] w-full h-full rounded-2xl border border-[#D7D7D8] ">
            <div className="flex  items-center justify-between font-semibold text-lg border-b border-[#D7D7D8] py-[16px] px-[24px] ">My Discussion Room
              <div className=" relative top-1 ">
              <Menu>
                <MenuButton>
                  <FilterIcon />
                </MenuButton>
                <MenuItems anchor="bottom ">
                  <div className=" bg-white w-[200px] flex flex-col justify-center rounded-3xl border border-[#D7D7D8] rounded-tr-[2px]  ">
                    <MenuItem>
                      <div
                        className="flex  data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px]  hover:rounded-tl-2xl  "
                        onClick={() => {
                          setOpenDraft(false);
                        }}
                      >
                        <AllChats/>
                        All Chats
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] border border-[#D7D7D8] ">
                        <UnreadMessageIcon/>
                        Unread Chats
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] border border-[#D7D7D8] border-t-0  ">
                        <ArchiveIcon/>
                        Archived Chats
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div
                        className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] hover:rounded-b-2xl    "
                        onClick={() => setOpenDraft(true)}
                      >
                        <DraftMessagesIcon/>
                        Drafts
                      </div>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
              </div>
            </div>
            <div className="flex p-[24px] items-center gap-[16px] ">
              <div className="outline-none flex gap-[12px] border border-[#D7D7D8] py-[10px] px-[12px] bg-[#F2F3F5] rounded-xl">
                <SearchIcon/>
              <input
                placeholder="Search users"
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-[#F2F3F5]"
              />
              </div>
              <span
                onClick={() => {
                  setOpenStarChat(true);
                }}
              >
                <StarIcon />
              </span>
              <span
                onClick={() => setOpenDiscussionModal(true)}
                className="cursor-pointer  bg-[#1660CD] text-[#FFFFFF] py-[12px] px-[20px] rounded-xl "
              >
                New Room
              </span>
            </div>
            <div className=" p-[24px] pt-0 ">
              {groups &&
                !openDraft &&
                groups.map((group, index) => {
                  console.log(group, " Draft:1");
                  return (
                    <div key={index}>
                      <p
                        className={` ${groupChatRoom?._id==group?._id && "bg-[#E8EFFA] "} cursor-pointer p-[12px] rounded-xl flex gap-[12px] `}
                        onClick={() => { handleGroupOpen(group) }}
                      >
                        <img
                          src={group.groupAdmin.pic}
                          className=" w-[48px] h-[48px] rounded-full "
                        />
                        <div className=" w-full ">
                          <div className=" flex justify-between w-full items-center " >
                            <p className=" font-medium text-base ">{group.chatName}</p>
                            <p className=" text-[#949497] text-[12px] leading-[18px] ">{getTimeAgo(group?.latestMessage?.createdAt)}</p>
                          </div>
                          <div className=" flex w-full justify-between ">
                            <p>{draftMessages && draftMessages[group?._id] ? `Draft: ${ draftMessages[group?._id]?.draftMessage}` : group?.latestMessage?.content ?? "Start a converstion"}</p>
                            <p className=" bg-[#1660CD] text-[10px] text-white rounded-lg py-[6px] px-[8px] max-h-[20px] max-w-[22px] flex items-center ">2</p>
                          </div>
                        </div>
                      </p>
                    </div>
                  );
                })}
              {openDraft &&
                Object.values(draftMessages).map((group, index) => {
                  
                  return (
                    <div key={index}>
                      <p
                        className="hover:bg-orange-400 cursor-pointer p-2 rounded-md flex gap-[12px]"
                        onClick={() => {
                          setGroupChatRoom(group.groupChatRoom);
                          setOpenStarChat(false);
                        }}
                      >
                        <img
                          src={group.groupChatRoom.groupAdmin.pic}
                          className="w-[48px] h-[48px] rounded-full"
                        />
                        <div>
                          <p>{group.groupChatRoom.chatName}</p>
                          <p>
                            {draftMessages[group.groupChatRoom._id]
                              ? `Draft: ${
                                  draftMessages[group.groupChatRoom._id]
                                    ?.draftMessage
                                }`
                              : group.groupChatRoom.latestMessage?.content}
                          </p>
                        </div>
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {openStarChat ? (
          <div className="flex flex-col flex-1 bg-green-900 p-[32px]">
            <p>Starred Chats</p>
            <div>
              {starredMessages.map((message, index) => {
                return (
                  <div className=" bg-yellow-600">
                    <p>{message.content}</p>
                    <span
                      onClick={() => {
                        handleStarMessage(message, true);
                      }}
                    >
                      Remove
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          groupChatRoom ? (
            <div className="flex flex-col border border-[#D7D7D8] rounded-2xl relative bg-white w-full h-full ">
              <div className="font-bold text-xl py-[16px] px-[24px] relative ">
                {groupChatRoom?.chatName}

                <div className=" absolute bg-red-500 -bottom-12 ">1</div>
                <div className=" absolute bg-red-500 -bottom-12 ">1</div>
              </div>
              {pinnedMessages.map((message, index) => {
                return (
                  <div key={index} className="mb-2 bg-red-400">
                    <p
                      className=" bg-yellow-300 cursor-pointer "
                      onClick={() => {
                        handlePinMessage(message);
                      }}
                    >
                      Unpin
                    </p>
                    {allowSelect && (
                      <input
                        type="checkbox"
                        onClick={() =>
                          setSelectMessage((prev) => {
                            return [...prev, message];
                          })
                        }
                      />
                    )}
                    <p>
                      <strong>Sender:</strong> {message.sender.username}
                    </p>

                    <div className=" flex gap-[24px]  ">
                      {!message.isDeleted || !message.isDeletedForEveryOne ? (
                        <p>{message.content}</p>
                      ) : (
                        <p>Message is deleted</p>
                      )}

                      {message.messageType == "application/pdf" && (
                        <div>
                          <p>{extractFileName(message.link)}</p>
                          <a href={message.link}>PDF</a>
                        </div>
                      )}

                      <div>
                        {message?.messageType == "image/png" &&
                          message.link != null && (
                            <img
                              src={message.link}
                              alt="Uploaded file"
                              style={{ maxWidth: "100%", height: "auto" }}
                            />
                          )}

                        {message?.messageType == "application/msword" &&
                          message.link != null && (
                            <div>
                              <p>{extractFileName(message.link)}</p>
                              <a href={message.link}>Word</a>
                            </div>
                          )}

                        {message?.messageType == "application/vnd.ms-excel" &&
                          message.link != null && (
                            <div>
                              <p>{extractFileName(message.link)}</p>
                              <a href={message.link}>Word</a>
                            </div>
                          )}

                        {message?.messageType ==
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                          message.link != null && (
                            <div>
                              <p>{extractFileName(message.link)}</p>
                              <a href={message.link}>Word</a>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <InfiniteScroll
                dataLength={chatMessage?.length || 0}
                next={fetchMoreChats}
                hasMore={hasMoreData}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                className=" bg-green-500 "
                height={"50vh"}
              >
                {chatMessage?.map((message, index) => {
                  console.log(message.link, "File available at:");
                  return (
                    <>
                      <div key={index} ref={(el) => (messageRef.current[index] = el)}  data-id={message._id} className="mb-2">
                        {allowSelect && (
                          <input
                            type="checkbox"
                            onClick={() =>
                              setSelectMessage((prev) => {
                                return [...prev, message];
                              })
                            }
                          />
                        )}
                        <p>
                          <strong>Sender:</strong> {message.sender?.username || JSON.parse(localStorage.getItem('user')).username}

                        </p>

                        <div className=" flex gap-[24px]  ">
                          {!message.isDeleted ||
                          !message.isDeletedForEveryOne ? (
                            <p>{message.content}</p>
                          ) : (
                            <p>Message is deleted</p>
                          )}

                          {message.messageType == "application/pdf" && (
                            <div>
                              <p>{extractFileName(message.link)}</p>
                              <a href={message.link}>PDF</a>
                            </div>
                          )}

                          <div>
                            {message?.messageType == "image/png" &&
                              message.link != null && (
                                <img
                                  src={message.link}
                                  alt="Uploaded file"
                                  style={{ maxWidth: "100%", height: "auto" }}
                                />
                              )}

                            {message?.messageType == "application/msword" &&
                              message.link != null && (
                                <div>
                                  <p>{extractFileName(message.link)}</p>
                                  <a href={message.link}>Word</a>
                                </div>
                              )}

                            {message?.messageType ==
                              "application/vnd.ms-excel" &&
                              message.link != null && (
                                <div>
                                  <p>{extractFileName(message.link)}</p>
                                  <a href={message.link}>Word</a>
                                </div>
                              )}

                            {message?.messageType ==
                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                              message.link != null && (
                                <div>
                                  <p>{extractFileName(message.link)}</p>
                                  <a href={message.link}>Word</a>
                                </div>
                              )}

                            <p>
                            <ReadIcon iconColor={ message?.isReadByAll.length === groupChatRoom.users.length ? "#1600D0" : "#57585C" }/>
                            </p>
                          </div>

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
                                      setReplyTo(message.sender?._id);
                                      setReplyToUserName(
                                        message.sender.username
                                      );
                                    }}
                                  >
                                    Reply To
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="block data-[focus]:bg-blue-100"
                                    onClick={() => {
                                      handleStarMessage(message, false);
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
                                <MenuItem>
                                  <p
                                    className="block data-[focus]:bg-blue-100"
                                    onClick={() => {
                                      setEditMessage(message);
                                      setNewMessage(message.content);
                                    }}
                                  >
                                    Edit
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="block data-[focus]:bg-blue-100"
                                    onClick={() => {
                                      setAllowSelect(true);
                                      setSelectMessage((prev) => {
                                        return [...prev, message];
                                      });
                                    }}
                                  >
                                    Select
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="block data-[focus]:bg-blue-100"
                                    onClick={() => {
                                      setForward(true);
                                    }}
                                  >
                                    Forward
                                  </p>
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </Menu>
                        </div>
                      </div>
                    </>
                  );
                })}
              </InfiniteScroll>
              <div className="absolute bottom-0 flex flex-col w-full p-2 bg-white border-t border-gray-300">
                {replyToUsername != null && (
                  <p>replying to {replyToUsername}</p>
                )}
                {allowSelect && (
                  <div className=" flex ">
                    <p>Star</p>
                    <p>Copy</p>
                    <p>Forward</p>
                    <p>Delete</p>
                    <button>cancel</button>
                  </div>
                )}
                {file && <p>{file[0]?.name}</p>}
                <label htmlFor="filePicker" className="cursor-pointer">
                  <PaperClip />
                </label>
                <div
                  onClick={() => {
                    setOpenEmoji(!openEmoji);
                  }}
                >
                  <p><EmojiIcon/></p>
                  {openEmoji && (
                    <EmojiPicker
                      onEmojiClick={(emojiObject, event) => {
                        handleMessageChange(
                          false,
                          emojiObject.emoji,
                          groupChatRoom
                        );
                      }}
                      open={openEmoji}
                    />
                  )}
                </div>
                <input
                  id="filePicker"
                  type="file"
                  accept=".pdf, .jpeg, .jpg, .png, .gif, .doc, .docx, .txt, .xls, .xlsx, .csv"
                  className="hidden" // Hide the file input element
                  onChange={(e) => handleFileUpload(e.target.files)} // Handle file upload
                />
                <input
                  className="outline-none border border-red-300 w-full p-2 rounded-md"
                  value={newMessage}
                  onChange={(e) => handleMessageChange(e, false, groupChatRoom)}
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
          ):(
            <div>Select a room</div>
          )
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
                          <option key={user?._id} value={user?._id}>
                            {user.username} - {user?._id}
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
                  {selectedMessage?.sender?._id != user?._id && (
                    <button onClick={() => handleDelete("deleteForAll")}>
                      Delete For Everyone
                    </button>
                  )}
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={forward} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-30 overflow-y-auto"
          onClose={() => setOpenDeleteModal(false)}
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-lg font-bold">
                Froward Message
              </DialogTitle>
              <div className="mt-2">
                <Description>
                  <div>
                    {groups &&
                      !openDraft &&
                      groups.map((group, index) => {
                        return (
                          <div key={index}>
                            <p
                              className="hover:bg-orange-400 cursor-pointer p-2 rounded-md flex gap-[12px] "
                              onClick={() => {
                                setGroupChatRoom(group);
                                setOpenStarChat(false);
                              }}
                            >
                              <img
                                src={group.groupAdmin.pic}
                                className=" w-[48px] h-[48px] rounded-full "
                              />
                              <div>
                                <p>{group.chatName}</p>
                                <p>
                                  {draftMessages && draftMessages[group?._id]
                                    ? `Draft: ${
                                        draftMessages[group?._id]?.draftMessage
                                      }`
                                    : group?.latestMessage?.content}
                                </p>
                              </div>
                            </p>
                          </div>
                        );
                      })}
                    {openDraft &&
                      Object.values(draftMessages).map((group, index) => {
                        console.log(
                          group.groupChatRoom?._id,
                          draftMessages,
                          " Draft:"
                        );
                        return (
                          <div key={index}>
                            <p
                              className="hover:bg-orange-400 cursor-pointer p-2 rounded-md flex gap-[12px]"
                              onClick={() => {
                                setGroupChatRoom(group.groupChatRoom);
                                setOpenStarChat(false);
                              }}
                            >
                              <img
                                src={group.groupChatRoom.groupAdmin.pic}
                                className="w-[48px] h-[48px] rounded-full"
                              />
                              <div>
                                <p>{group.groupChatRoom.chatName}</p>
                                <p>
                                  {draftMessages[group.groupChatRoom._id]
                                    ? `Draft: ${
                                        draftMessages[group.groupChatRoom._id]
                                          ?.draftMessage
                                      }`
                                    : group.groupChatRoom.latestMessage
                                        ?.content}
                                </p>
                              </div>
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </Description>
                <div className=" border-t border-[#5758C] flex gap-[24px] ">
                  <button onClick={() => setForward(false)}>Cancel</button>
                  {selectedMessage?.sender?._id != user?._id && (
                    <button onClick={false}>Forward</button>
                  )}
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
