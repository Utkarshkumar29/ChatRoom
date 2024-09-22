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
  Switch,
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
import { formatDistanceToNow } from "date-fns";
import SendIcon from "../../assets/icons/SendIcon";
import CopyIcon from "../../assets/icons/CopyIcon";
import PinIcon from "../../assets/icons/PinIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import SelectIcon from "../../assets/icons/SelectIcon";
import ForwardIcon from "../../assets/icons/ForwardIcon";
import StarMessageIcon from "../../assets/icons/StarMessageIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import DownloadIcon from "../../assets/icons/DownloadIcon";
import PDFIcon from "../../assets/icons/PDFIcon"
import ExcelIcon from "../../assets/icons/ExcelIcon";
import InfoSquare from "../../assets/icons/InfoSquare";
import MediaIcon from "../../assets/icons/MediaIcon";
import DocumentIcon from "../../assets/icons/DocumentIcon";
import MemberIcon from "../../assets/icons/MemberIcon";
import PencilIcon from "../../assets/icons/PencilIcon";
import CrossIcon from "../../assets/icons/CrossIcon";
import AlertIcon from "../../assets/icons/AlertIcon";
import DoctIcon from "../../assets/icons/DoctIcon";
import ClassicSpinner from "../../components/loader/ClassicSpinner";
import TickIcon from "../../assets/icons/TickIcon";
import NullImage from "../../assets/Null.svg"


const Discussions = () => {
  const [openDiscussionModal, setOpenDiscussionModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupChatRoom, setGroupChatRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessage, setChatMessage] = useState([]);
  const { user } = useContext(UserContext);
  const [socketConnected, setSocketConnected] = useState(false);
  const [chatcount, setChatCount] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
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
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [openGroupMenu,setOpenGroupMenu]=useState(false)
  const [selectedMenu,setSelectedMenu]=useState("about")
  const [enabled, setEnabled] = useState(false)
  const [openExitRoomModal,setExitRoomModal]=useState(false)
  const [openDeleteRoomModal,setDeleteRoomModal]=useState(false)
  const [openReportRoomModal,setReportRoomModal]=useState(false)
  const [groupMedia,setGroupMedia]=useState([])
  const [groupDocument,setGroupDocument]=useState([])
  const [editGroupName,setEditGroupName]=useState(null)
  const [editGroupDescription,setEditGroupDescription]=useState(null)
  const [unReadGroups,setUnReadGroups]=useState([])
  const [openUnReadGroups,setOpenUnReadGroups]=useState(false)
  const [addMember,setAddMember]=useState(false)
  const [addMemberList,setAddMemberList]=useState([])
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatRoom,setChatRoom]=useState([])

  const token = localStorage.getItem('token');  
  console.log(token,'motel')
  
  useEffect(() => {
  
    const updatedUnReadGroups = groups.map((group) => {
      const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id; 
      const unseenMessage = group.unSeenMessages.find(
        (unseen) => unseen.user === loggedInUserId
      );
      return {
        ...group, 
        unreadCount: unseenMessage ? unseenMessage.count : 0,
      };
    }).filter(group => group.unreadCount > 0);

    setUnReadGroups(updatedUnReadGroups);
    console.log(unReadGroups,'rakazone')
  }, [groups]);

  const ReasonsToReport=[
    "Hate speech or symbols",
    "Scam or Fraud",
    "Nudity or sexual activity",
    "Violence or dangerous organisations",
    "Sale of illegal or regulated goods",
    "Bullying or harassment",
    "Intellectual property violation",
    "Suicide or self injury",
    "Spam",
    "Reason not listed"
  ]

  const fetchGroupMedia=async()=>{
    try {
      const response = await axios.get(`https://chatroom-y7ou.onrender.com/api/message/groupMedia/${groupChatRoom._id}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    });
      setGroupMedia(response.data)
    } catch (error) {
        console.log(error)
    }
  }

  const fetchGroupDocument=async()=>{
    try {
      const response=await axios.get(`https://chatroom-y7ou.onrender.com/api/message/groupDocument/${groupChatRoom._id}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    })
      setGroupDocument(response.data)
      console.log(response.data,'trying')
    } catch (error) {
        console.log(error)
    }
  }

  const handleSelectedMenu=(section)=>{
    setSelectedMenu(section)

    if(section=="media"){
      fetchGroupMedia()
    }

    if(section=="document"){
      fetchGroupDocument()
    }
  }

  const userId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    console.log(openMenuIndex, "power");
  }, [openMenuIndex]);

  const ENDPOINT = "http://localhost:5000";
  const socket = useRef(null);

  // Setup socket connection and listeners
  useEffect(() => {
    socket.current = io(ENDPOINT, { transports: ["websocket"] });

    socket.current.on("connection", () => {
      setSocketConnected(true);
    });

    socket.current.emit("setup", user);
  }, []);

  // Search for users
  const handleSearch = async (keyword) => {
    try {
      const response = await axios.get(`https://chat-room-eight-rouge.vercel.app/api/user?search=${keyword}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    });
      setUserList(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

   // Check and create chat with a user
   const checkAndCreateChat = async (user) => {
    setSelectedChat(user);
    try {
        const response = await axios.post('https://chat-room-eight-rouge.vercel.app/api/chats', { userId: user?._id }, {
          headers: {
              'Authorization': `Bearer ${token}`, // Set the Authorization header
          },withCredentials: true,
      });
        console.log('Chat response:', response.data);
        setGroupChatRoom(response.data);
        socket.current.emit("join chat", response.data?._id);
    } catch (error) {
        console.error('Error checking or creating chat:', error);
    }
};

  const addMembers = async () => {
    try {
      const data = {
        chatId: groupChatRoom?._id,
        userIds: addMemberList, // Assuming addMemberList is an array of user IDs
      };
  
      const response = await axios.put(`https://chat-room-eight-rouge.vercel.app/api/chats/groupadd`, data, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    });
      console.log('Response Data:', response.data); // Log the entire response for debugging
  
      // Assuming the response contains the updated groupChatRoom object
      const updatedGroupChatRoom = response.data; // Adjust based on actual response structure
  
      // Update the group chat room state with the new users
      setGroupChatRoom((prevGroup) => {
        // Create a new users array that combines existing users with the updated ones
        const updatedUsers = updatedGroupChatRoom.users; // This should be the updated users array from the response
  
        return {
          ...prevGroup,
          users: updatedUsers,
        };
      });
      setUserList([])
      setAddMemberList([])
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleRemoveMember=async(userId)=>{
    try {
      const data={
        userId:userId,
        chatId:groupChatRoom._id
      }
        const response=await axios.put(`https://chat-room-eight-rouge.vercel.app/api/chats/groupremove`,data, {
          headers: {
              'Authorization': `Bearer ${token}`, // Set the Authorization header
          },withCredentials: true,
      })
        console.log(response)
        setGroupChatRoom((prevGroup) => ({
          ...prevGroup,
          users: prevGroup.users.filter((user) => user._id !== userId),
        }));
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch chat groups
  const accessChat = async () => {
    try {
      const response = await axios.get("https://chat-room-eight-rouge.vercel.app/api/chats", {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    });
      const filterGroups = response.data.filter(
        (group) => group.isGroupChat === false
      );
      setChatRoom(filterGroups);
      console.log(chatRoom,'kite')
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
    } else {
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
    if (draft) {
      setNewMessage(draft?.draftMessage);
    } else {
      setNewMessage("");
    }
  }, [groupChatRoom]);

  // Send a new message
  const sendMessage = async (messageType) => {
    const userId=JSON.parse(localStorage.getItem('user'))._id
    try {
      if (editMessage) {
        console.log(newMessage,"faltu1")
        const response = await axios.put("https://chat-room-eight-rouge.vercel.app/api/message/edit", {
          messageId: editMessage._id,
          content: newMessage,
          userId:userId
        }, {
          headers: {
              'Authorization': `Bearer ${token}`, // Set the Authorization header
          },withCredentials: true,
      });
        setChatMessage((message) => {
          return message.map((item) =>
            item._id == editMessage._id
              ? {  content: newMessage,...item }
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
      } else if( fileUrl ){
        console.log(newMessage,"faltu2")
        console.log(fileUrl)
          // Send message with file URL
          if (groupChatRoom?._id && fileUrl && file?.[0]?.type) {
            const response = await axios.post("https://chat-room-eight-rouge.vercel.app/api/message", {
                chatId: groupChatRoom._id,
                content: null,
                link: fileUrl,
                messageType: file[0].type,
                userId:userId
            }, {
              headers: {
                  'Authorization': `Bearer ${token}`, // Set the Authorization header
              },withCredentials: true,
          });
            setChatMessage((prevMessages) => [response.data,...prevMessages]);
            socket.current.emit("newMessage", response.data);
            setNewMessage("");
            console.log('power1',groupChatRoom?._id,fileUrl,file?.[0]?.type)
            setFile(null)
        }
        console.log('power1',groupChatRoom?._id,fileUrl,file)
      } else if(messageType=="left"){
        console.log(newMessage,"faltu3")
  
        const response = await axios.post("https://chat-room-eight-rouge.vercel.app/api/message", {
          chatId: groupChatRoom?._id,
          content:  `${JSON.parse(localStorage.getItem('user')).username} has left the group`,
          messageType:"left",
          userId:userId
        }, {
          headers: {
              'Authorization': `Bearer ${token}`, // Set the Authorization header
          },withCredentials: true,
      });
  
        setChatMessage((prevMessages) => [response.data,...prevMessages]);
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
        setReplyTo(null)
        setReplyMessage(null)
      } else {
        console.log("faltu4")
        const response = await axios.post("https://chat-room-eight-rouge.vercel.app/api/message", {
          chatId: groupChatRoom?._id,
          content: newMessage,
          replyTo: replyTo,
          messageType:"text",
          link: null,
          replyMessage: replyMessage,
          userId:userId
        }, {
          headers: {
              'Authorization': `Bearer ${token}`, // Set the Authorization header
          },withCredentials: true,
      });
        setChatMessage((prevMessages) => [response.data,...prevMessages]);
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
        setReplyTo(null)
        setReplyMessage(null)
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }finally{
      console.log("faltu5")
    }
  };

  useEffect(() => {
    console.log(replyMessage, "replyMessage");
  }, [replyMessage]);

  // Handle incoming messages
  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      console.log("New message received:", newMessageReceived);
      console.log("Current chat room ID:", groupChatRoom?._id);
      console.log("Received message's chat ID:", newMessageReceived.chat?._id);
  
      // If the message is for the current chat, update the chat messages
      if (groupChatRoom && groupChatRoom?._id === newMessageReceived.chat?._id) {
        setChatMessage((prevMessages) => [newMessageReceived, ...prevMessages]);
      } else {
        console.log("Message received in a different chat.");
      }
  
      // Update the 'groups' state, particularly 'unSeenMessages' and 'latestMessage'
      setGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group._id === newMessageReceived.chat._id) {
            
            // Update unSeenMessages for everyone except the sender
            const updatedUnSeenMessages = group.unSeenMessages.map((unseen) => {
              if (unseen.user !== newMessageReceived.sender._id) {
                return { ...unseen, count: unseen.count + 1 }; // Increment unseen count for everyone except the sender
              }
              return unseen;
            });
  
            // Return the updated group with the new latest message and unseen messages
            return {
              ...group,
              latestMessage: newMessageReceived, // Update latestMessage for everyone
              unSeenMessages: updatedUnSeenMessages,
            };
          }
          return group; // Return group as is if no match
        })
      );
      console.log("Updated groups:", groups);
    };
  
    // Listen for the "message received" event from socket
    socket.current.on("message received", handleMessageReceived);
  
    // Cleanup the socket event listener when the component unmounts or groupChatRoom changes
    return () => {
      socket.current.off("message received", handleMessageReceived);
    };
  }, [groupChatRoom, setChatMessage, setGroups]);
  

  useEffect(() => console.log(groups,'lol'), [groups]);

  const [nextLink, setNextLink] = useState("");
  // Fetch chat messages
  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `https://chat-room-eight-rouge.vercel.app/api/message/${groupChatRoom?._id}?page=1&limit=10`, {
          headers: {
              'Authorization': `Bearer ${token}`, // Set the Authorization header
          },withCredentials: true,
      }
      );
      setChatMessage(response.data.results);
      setChatCount(response.data.count);
      setNextLink(response.data.links.next);
      socket.current.emit("join chat", groupChatRoom?._id);
    } catch (error) {
      console.log("Error fetching chat messages:", error);
    }
  };

  const fetchMoreChats = async () => {
    try {
      const response = await axios.get(nextLink, {
        withCredentials: true,
      }, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
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
    console.log("kite use")
  }, []);

  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setFile(file);

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
        }
      );
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const handleGroupImage = async (file) => {
    if (!file) return;

    setFile(file);

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
      const response = await axios.put("https://chat-room-eight-rouge.vercel.app/api/message", {
        messageId: selectedMessage?._id,
        deleteMsg: deleteMsg,
        deleteForEveryone: deleteForEveryone,
      }, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
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

  useEffect(() => {}, [chatMessage]);

  //star messages======================================================
  const handleStarMessage = async (data, isStarred) => {
    try {
      const response = await axios.put(`https://chat-room-eight-rouge.vercel.app/api/message/star`, {
        messageId: data?._id,
        userId: user?._id,
        isStarred: isStarred,
      }, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
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
      console.log(error);
    }
  };

  const getStarMessage = async () => {
    try {
      const response = await axios.get(`https://chat-room-eight-rouge.vercel.app/api/message/star`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    });

      setStarredMessages(response.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStarMessage();
  }, [openStarChat]);

  //pin message===================================
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const getPinnedMessages = async () => {
    try {
      const response = await axios.get(
        `https://chat-room-eight-rouge.vercel.app/api/message/pinnedmessages/${groupChatRoom?._id}`, {
          headers: {
              'Authorization': `Bearer ${token}`, // Set the Authorization header
          },withCredentials: true,
      }
      );
      setPinnedMessages(response.data);
    } catch (error) {
      console.log("Error fetching pinned messages", error); // Log errors to debug
    }
  };

  useEffect(() => {
    if (groupChatRoom != null) {
      getPinnedMessages();
    }
  }, [groupChatRoom]);

  const handlePinMessage = async (data) => {
    try {
      const response = await axios.put(`https://chat-room-eight-rouge.vercel.app/api/message/pinnedmessages`, {
        messageId: data?._id,
        pinStatus: data.isPinned,
      }, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
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
      setPinnedMessages((prev) =>
        prev.filter((message) => message?._id !== newPinMessaege?._id)
      );
    };
    socket.current.on("unpinned message", handleIncommingUnPinnedMessage);

    return () => {
      socket.current.off("unpinned message", handleIncommingUnPinnedMessage);
    };
  }, [groupChatRoom]);

  const extractFileName = (url) => {
    // Decode URL components
    const decodedUrl = decodeURIComponent(url);
    // Split URL by '/' and get the last segment before '?'
    const parts = decodedUrl.split("/");
    const fileNameWithQuery = parts.pop();
    const fileName = fileNameWithQuery.split("?")[0];

    return fileName;
  };

  const messageRef = useRef([]);
  const seenMessages = useRef(new Set());

  useEffect(()=>{
    console.log("trying",groupChatRoom?.users)
  },[groupChatRoom])

  useEffect(() => {
    const observer = new IntersectionObserver((enteries) => {
      enteries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageId = entry.target.getAttribute("data-id");

          // Avoid calling markAsSeen if the message is already seen
          if (!seenMessages.current.has(messageId)) {
            seenMessages.current.add(messageId); // Mark as seen
            markAsSeen(
              messageId,
              JSON.parse(localStorage.getItem("user"))?._id
            );
          }
        }
      });
    });

    messageRef.current.forEach((messageRef) => {
      if (messageRef) {
        observer.observe(messageRef);
      }
    });

    return () => {
      messageRef.current.forEach((messageRef) => {
        if (messageRef) {
          observer.unobserve(messageRef);
        }
      });
    };
  }, [chatMessage]);

  const markAsSeen = async (messageId, userId) => {
    try {
      const response = await axios.put(`https://chat-room-eight-rouge.vercel.app/api/message/seen`, {
        messageId: messageId,
        userId: userId,
        chatId: groupChatRoom?._id, // Pass the current chat room ID
      }, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    });
  
      // Update the chat messages to reflect the seen status
      setChatMessage((messages) =>
        messages.map((message) =>
          message?._id === response?.data?.message?._id
            ? { ...message, isReadByAll: [...message.isReadByAll, userId] }
            : message
        )
      );
  
      // Update the unseen messages count in the group
      setGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group._id === groupChatRoom?._id) {
            const updatedUnSeenMessages = group.unSeenMessages.map((unseen) => {
              // Reset the count to 0 for the user who has seen the message
              if (unseen.user === userId) {
                return { ...unseen, count: 0 };
              }
              return unseen; // Return the unchanged unseen message for other users
            });
  
            // Return the updated group
            return {
              ...group,
              unSeenMessages: updatedUnSeenMessages,
            };
          }
          return group; // Return the group unchanged if it doesn't match the current chat room
        })
      );
  
    } catch (error) {
      console.log("Error in markAsSeen:", error);
    }
  };
  

  const handleGroupOpen = (group) => {
    setGroupChatRoom(group);
    setOpenStarChat(false);
  };

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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const deleteGroup = async () => {
    if (!groupChatRoom?._id) {
      console.error("Group ID is not available.");
      return;
    }
    try {
      const response = await axios.delete(`https://chat-room-eight-rouge.vercel.app/api/chats/${groupChatRoom?._id}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    });    
      if (response.status === 200) {
        console.log("Group chat deleted successfully.");
        await setGroups((prevGroups) => {
          return prevGroups.filter((group) => group._id !== groupChatRoom._id);
        });
        setGroupChatRoom(groups[1] || null)
        setDeleteRoomModal(false)
        console.log(groupChatRoom)
      } else {
        console.warn(`Unexpected response: ${response.statusText}`);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error in setting up the request:", error.message);
      }
    }
  };

  const groupRemove=async()=>{
    const userId=JSON.parse(localStorage.getItem('user'))._id;
    const username=JSON.parse(localStorage.getItem('user')).username;
    const data={
      chatId:groupChatRoom?._id,
      userId:userId
    }
    try {
      const response=await axios.put(`https://chat-room-eight-rouge.vercel.app/api/chats/groupremove`,data, {
        headers: {
            'Authorization': `Bearer ${token}`, // Set the Authorization header
        },withCredentials: true,
    })
        if(response.status==200){
          console.log("User removed from group successfully")
          setGroups((group)=>{
            if(group?._id==groupChatRoom?._id){
              return {...group,users:group.users.filter((user)=>user._id==JSON.parse(localStorage.getItem('user')._id))}
            }else{
              return group
            }
          })
          setNewMessage(`${username} has left the group`)
          sendMessage("left")
        }else{
          console.warn(`Unexpected response: ${response.statusText}`);
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(()=>{
    console.log(addMemberList,'power')
  },[addMemberList])

  const handleGroupNameChange = (e) => {
    setEditGroupName(e.target.value);
  };

  const handleGroupDescriptionChange = (e) => {
    setEditGroupDescription(e.target.value);
  };

  const updateGroup=async(e)=>{
    e.preventDefault()
    let data={}
    if(editGroupDescription!=null){
      data={
        chatId:groupChatRoom?._id,
        description:editGroupDescription,
        chatName:null
      }
    }else{
      data={
        chatId:groupChatRoom?._id,
        chatName:editGroupName,
        description:null
      }
    }
    console.log(data,'power')
    try {
        const response=await axios.put(`https://chat-room-eight-rouge.vercel.app/api/chats/group`,data, {
          headers: {
              'Authorization': `Bearer ${token}`, // Set the Authorization header
          },withCredentials: true,
      })
        if(response.status==200){
          console.log("Group updated successfully")
          if(editGroupDescription!=null){
            setGroupChatRoom((prev)=>{
              return {...prev,description:editGroupDescription}
            })
          }else{
            setGroups((prevGroups) => 
              prevGroups.map(group =>
                group._id === groupChatRoom?._id
                  ? { ...group, chatName: editGroupName }
                  : group
              )
            );
            setGroupChatRoom((prev)=>{
              return {...prev,chatName:editGroupName}
            })
          }
          setEditGroupName(null)
          setEditGroupDescription(null)
        }
    } catch (error) {
        console.log(error)
    }
  }
  
useEffect(()=>{
    console.log(groupChatRoom,'goa')
},[groupChatRoom])

  return (
    <>
      <div className="w-full flex h-screen bg-[#F2F3F5] py-[60px] px-[80px] gap-[32px]  ">
        <div className="h-full flex flex-col items-center gap-[24px] flex-1 w-full min-w-[500px] ">
          <div className=" max-w-[7 00px] bg-[#FFFFFF] w-full flex items-center justify-evenly py-[16px] px-[24px] rounded-2xl border border-[#D7D7D8] gap-[24px] ">
            <Link
              to="/chatRoom"
              className="w-full bg-[#1660CD] text-[#FFFFFF] py-[12px] px-[32px] rounded-xl text-center "
            >
              Messages
            </Link>
            <Link
              to="/discussions"
              className=" w-full text-[#1660CD] bg-[#FFFFFF] py-[12px] px-[32px] rounded-xl border border-[#1600CD] text-center "
            >
              Discussions
            </Link>
          </div>
          <div className=" relative bg-[#FFFFFF] w-full h-full rounded-3xl border border-[#D7D7D8] ">
            <div className="flex relative  items-center justify-between font-semibold text-lg border-b border-[#D7D7D8] py-[16px] px-[24px] ">
              <p>My Chats</p>
              <div className="  ">
                <Menu>
                  <MenuButton>
                    <FilterIcon />
                  </MenuButton>
                  <MenuItems anchor="bottom ">
                    <div className=" cursor-pointer bg-white w-[200px] flex flex-col justify-center rounded-3xl border border-[#D7D7D8] rounded-tr-[2px]  ">
                      <MenuItem>
                        <div
                          className="flex  data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px]  hover:rounded-tl-2xl  "
                          onClick={() => {
                            setOpenDraft(false);
                            setOpenUnReadGroups(false)
                          }}
                        >
                          <AllChats />
                          All Chats
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] border-y border-[#D7D7D8] " onClick={()=>setOpenUnReadGroups(true)}>
                          <UnreadMessageIcon />
                          Unread Chats
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] border-b border-[#D7D7D8] border-t-0  ">
                          <ArchiveIcon />
                          Archived Chats
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div
                          className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] hover:rounded-b-2xl    "
                          onClick={() => setOpenDraft(true)}
                        >
                          <DraftMessagesIcon />
                          Drafts
                        </div>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="flex p-[24px] pb-0 items-center gap-[16px] ">
              <div className="outline-none flex gap-[12px] w-full border border-[#D7D7D8] py-[10px] px-[12px] bg-[#F2F3F5] rounded-xl">
                <SearchIcon />
                <input
                  placeholder="Search users"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-[#F2F3F5] outline-none "
                />
                
              </div>
              <span
                onClick={() => {
                  setOpenStarChat(true);
                }}
              >
                <StarIcon />
              </span>
              
            </div>
            <InfiniteScroll
              dataLength={chatMessage?.length || 0}
              next={fetchMoreChats}
              hasMore={hasMoreData}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', // Ensure items are in reverse order
                overflowY: 'auto',// Enable vertical scrolling,
                paddingTop:"0px",
                padding:"16px",
                position:"relative"
              }}
              loader={<div className=" w-full h-[40px] bg-red-950 ">
                <ClassicSpinner/>
              </div>}
              scrollableTarget="scrollableDiv"
              className=" "
              height={"60vh"}
            >
              {groups && !openUnReadGroups && !openDraft && userList && userList.length > 0 && (
                <div className="text-black flex flex-col absolute bg-white  border border-[#D7D7D8] w-[400px] rounded-xl">
                  {userList.map((user, index) => (
                    <div
                      key={index}
                      className="border-b py-[12px] px-[16px] last:border-none border-[#D7D7D8] flex gap-[16px] hover:bg-slate-400 transition"
                      onClick={() => checkAndCreateChat(user)}
                    >
                      <img src={user?.pic} className="w-[24px] h-[24px] rounded-full" />
                      <p>{user?.username}</p>
                    </div>
                  ))}
                </div>
              )}

                {chatRoom && (
                  <div>
                    {chatRoom.map((group,index)=>{
                      console.log(group,'mouse')
                      return(
                        <div key={index}>
                      <p
                        className={` ${
                          groupChatRoom?._id == group?._id && "bg-[#E8EFFA] "
                        } cursor-pointer p-[12px] rounded-xl flex gap-[12px] `}
                        onClick={() => {
                          handleGroupOpen(group);
                          handleSelectedMenu("about")
                          setOpenGroupMenu(false)
                        }}
                      >
                        <img
                          src={group.users[1].pic}
                          className=" w-[48px] h-[48px] rounded-full "
                        />
                        <div className=" w-full ">
                          <div className=" flex justify-between w-full items-center ">
                            <p className=" font-medium text-base text-[#16171C] ">
                              {group?.users[1].username}
                            </p>
                            <p className=" text-[#949497] text-[12px] leading-[18px] ">
                              {getTimeAgo(group?.latestMessage?.createdAt)}
                            </p>
                          </div>
                          <div className=" flex w-full justify-between ">
                            <p className=" text-[#57585C] ">
                              {draftMessages && draftMessages[group?._id] ? (
                                <p>
                                  <span className=" text-[#1660CD] font-medium  ">
                                    Draft:
                                  </span>{" "}
                                  {draftMessages[group?._id]?.draftMessage}
                                </p>
                              ) : (
                                group?.latestMessage?.content?.length >25 ? group?.latestMessage?.content.substring(0,25)+`...` : group?.latestMessage?.content ??
                                "Start a converstion"
                              )}
                            </p>
                            {(group.unSeenMessages || []).map((unSeenMessage) => {
                              const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id; // Get logged-in user ID

                              // Check if the user ID matches the logged-in user
                              if (unSeenMessage.user === loggedInUserId && unSeenMessage.count > 0) {
                                return (
                                  <div
                                    key={unSeenMessage.user}
                                    className="bg-[#1660CD] text-[10px] text-white rounded-lg py-[6px] px-[8px] max-h-[20px] max-w-[22px] flex items-center"
                                  >
                                    {unSeenMessage.count} {/* Display the unseen message count */}
                                  </div>
                                );
                              }

                              return null; // Return null if the user does not match or count is 0
                            })}

                          </div>
                        </div>
                      </p>
                    </div>
                      )
                    })}
                  </div>
                )}
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
                          src={group.groupChatRoom.groupAdmin?.pic}
                          className="w-[48px] h-[48px] rounded-full"
                        />
                        <div>
                          <p>{group?.groupChatRoom.users[1].username }</p>
                          <p>
                            {draftMessages[group.groupChatRoom?._id]
                              ? `Draft: ${
                                  draftMessages[group.groupChatRoom?._id]
                                    ?.draftMessage
                                }`
                              : group.groupChatRoom.latestMessage?.content}
                          </p>
                        </div>
                      </p>
                    </div>
                  );
                })}
                {openUnReadGroups && unReadGroups.map((group, index) => {
                  console.log('copy',group)
                  return (
                    <div key={index}>
                      <p
                        className={` ${
                          groupChatRoom?._id == group?._id && "bg-[#E8EFFA] "
                        } cursor-pointer p-[12px] rounded-xl flex gap-[12px] `}
                        onClick={() => {
                          handleGroupOpen(group);
                          handleSelectedMenu("about")
                          setOpenGroupMenu(false)
                        }}
                      >
                        <img
                          src={group.groupAdmin?.pic}
                          className=" w-[48px] h-[48px] rounded-full "
                        />
                        <div className=" w-full ">
                          <div className=" flex justify-between w-full items-center ">
                            <p className=" font-medium text-base text-[#16171C] ">
                              {group?.users[1].username}
                            </p>
                            <p className=" text-[#949497] text-[12px] leading-[18px] ">
                              {getTimeAgo(group?.latestMessage?.createdAt)}
                            </p>
                          </div>
                          <div className=" flex w-full justify-between ">
                            <p className=" text-[#57585C] ">
                              {draftMessages && draftMessages[group?._id] ? (
                                <p>
                                  <span className=" text-[#1660CD] font-medium  ">
                                    Draft:
                                  </span>{" "}
                                  {draftMessages[group?._id]?.draftMessage}
                                </p>
                              ) : (
                                group?.latestMessage?.content?.length >25 ? group?.latestMessage?.content.substring(0,25)+`...` : group?.latestMessage?.content ??
                                "Start a converstion"
                              )}
                            </p>
                            {(group.unSeenMessages || []).map((unSeenMessage) => {
                              const loggedInUserId = JSON.parse(localStorage.getItem('user'))._id; // Get logged-in user ID

                              // Check if the user ID matches the logged-in user
                              if (unSeenMessage.user === loggedInUserId && unSeenMessage.count > 0) {
                                return (
                                  <div
                                    key={unSeenMessage.user}
                                    className="bg-[#1660CD] text-[10px] text-white rounded-lg py-[6px] px-[8px] max-h-[20px] max-w-[22px] flex items-center"
                                  >
                                    {unSeenMessage.count} {/* Display the unseen message count */}
                                  </div>
                                );
                              }

                              return null; // Return null if the user does not match or count is 0
                            })}

                          </div>
                        </div>
                      </p>
                    </div>
                  );
                })}
            </InfiniteScroll>
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
        ) : groupChatRoom ? (
          <div className="flex flex-col border border-[#D7D7D8] bg-white rounded-2xl relative w-full h-full ">
            <div className=" font-semibold text-xl py-[16px] px-[24px] relative flex border-b border-[#D7D7D8] max-h-[80px] " onClick={()=>setOpenGroupMenu(!openGroupMenu)} >
              <img
                src={groupChatRoom.groupPic}
                alt="Error"
                className=" w-[48px] h-[48px] rounded-full "
              />
              <div>
                <p>{groupChatRoom?.users[1].username}</p>
                <p>{groupChatRoom?.users.length}</p>
              </div>
            </div>
            {pinnedMessages.map((message, index) => {
              return (
                <div key={index} className=" absolute top-20 w-[97.5%] z-10 mb-2 bg-[#E8EFFA] m-[16px] p-[16px] rounded-2xl gap-[16px]  flex items-center">
                  <PinIcon/>
                  <div className=" w-full ">
                    <p className=" font-medium ">Pinned Message</p>
                    <div className=" flex " >
               <p className=" text-[#949497] ">{message?.sender.username}:{"  "} </p>
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

                      {message?.messageType=="left" && 
                      <div>{message.content} has left the group</div>}
                    </div>
                  </div>
                    </div>
                  </div>
                  <p
                    className=" py-[12px] px-[32px] rounded-xl bg-[#1660CD] text-white max-h-[44px] max-w-[106px] flex justify-center items-center cursor-pointer "
                    onClick={() => {
                      handlePinMessage(message);
                    }}
                  >
                    Unpin
                  </p>
                </div>
              );
            })}
            {openGroupMenu && (
                      <div className=" absolute top-20  z-10 bg-[#16171C7A] w-full min-h-[78.55vh] rounded-b-2xl flex p-[32px] gap-[24px] justify-center  ">
                        <div className="w-full max-w-[300px] cursor-pointer h-min bg-white flex-col flex rounded-2xl p-[8px]">
                          <p onClick={()=>handleSelectedMenu("about")} className={` ${selectedMenu=="about" && " bg-[#E8EFFA] "} rounded-xl flex pt-[12px] pr-[24px] pb-[12px] pl-[16px] gap-[16px]  `}><InfoSquare/>About</p>
                          <p onClick={()=>handleSelectedMenu("media")} className={` ${selectedMenu=="media" && " bg-[#E8EFFA] "} rounded-xl  flex pt-[12px] pr-[24px] pb-[12px] pl-[16px] gap-[16px] `}><MediaIcon/>Media</p>
                          <p onClick={()=>handleSelectedMenu("document")} className={` ${selectedMenu=="document" && " bg-[#E8EFFA] "} rounded-xl  flex pt-[12px] pr-[24px] pb-[12px] pl-[16px] gap-[16px] `}><DocumentIcon/>Documents</p>
                          <p onClick={()=>handleSelectedMenu("members")} className={` ${selectedMenu=="members" && " bg-[#E8EFFA] "} rounded-xl flex pt-[12px] pr-[24px] pb-[12px] pl-[16px] gap-[16px] `}><MemberIcon/>Members</p>
                        </div>
                        <div className=" max-w-[550px] h-min bg-white w-full rounded-2xl  ">
                            {selectedMenu=="about" && (
                              <div className="  ">
                                <p className=" py-[16px] px-[24px] font-semibold text-[18px] leading-[27px] border-b border-[#D7D7D8] ">About {groupChatRoom?.chatName} </p>
                                <div className=" flex gap-[24px] py-[16px] px-[24px] border-b border-[#D7D7D8] ">
                                  <img src={groupChatRoom.groupPic} alt="Error" className=" min-w-[96px] h-[96px] rounded-full  " />
                                  <div className=" flex flex-col justify-center w-full ">
                                    {editGroupName!=null ? (
                                      <form className=" flex items-center gap-[24px] w-full" onSubmit={updateGroup}>
                                        <input className=" w-full border border-[#D7D7D8] py-[10px] px-[24px] rounded-xl outline-none " placeholder="Enter new  group name" onChange={handleGroupNameChange}/>
                                        <div className=" flex gap-[16px] ">
                                        <span onClick={()=>setEditGroupName(null)} className=" cursor-pointer "><CrossIcon/></span>
                                        <button type="submit"><TickIcon/></button>
                                        </div>
                                        </form>
                                    ):(<div>
                                      <p className=" flex w-[164px] justify-between font-medium text-[#16171C] ">{groupChatRoom?.users[1].username} <span onClick={()=>setEditGroupName("")}><PencilIcon/></span> </p>
                                      <p className=" text-[#57585C] ">{groupChatRoom.users.length} Members</p>
                                    </div>)}
                                  </div>                                  
                                </div>
                               
                               
                                <div className=" flex justify-between py-[16px] px-[24px] border-b border-[#D7D7D8]  ">
                                  <p className=" font-semibold ">Mute Notification</p>
                                  <Switch
                                      checked={enabled}
                                      onChange={setEnabled}
                                      className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                                    >
                                      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                                    </Switch>
                                </div>
                               
                                <div className=" py-[16px] px-[32px] flex gap-[16px] justify-center ">
                                      
                                    
                                    <button onClick={()=>setReportRoomModal(true)} className=" cursor-pointer w-[220px] text-[#57585C] border border-[#57585C] py-[12px] px-[40px] rounded-2xl flex justify-center ">
                                      Block
                                    </button>
                                    <button onClick={()=>setDeleteRoomModal(true)} className=" cursor-pointer w-[220px] text-[#FA1111] border border-[#FA1111] py-[12px] px-[40px] rounded-2xl flex justify-center ">
                                      Delete Room
                                    </button>
                                </div>
                              </div>
                            )}
                            {selectedMenu=="media" && (
                              <div>
                                <p className=" py-[16px] px-[24px] font-semibold text-[18px] leading-[27px] border-b border-[#D7D7D8] ">Media</p>
                                <div className=" flex flex-wrap p-[16px] gap-[16px] ">
                                  {groupMedia.length>0 ? (
                                    groupMedia.map((image,index)=>{
                                      return(
                                        <div className="">
                                        <img src={image.link} alt="Error" className=" w-[90px] h-[90px]"/>
                                      </div>
                                      )
                                    })
                                  ):(
                                    <p>No media is exchanged</p>
                                  )}
                                </div>
                              </div>
                            )}
                            {selectedMenu=="document" && (
                              <div>
                                <p className=" py-[16px] px-[24px] font-semibold text-[18px] leading-[27px] border-b border-[#D7D7D8] ">Documents</p>
                                <div className=" flex flex-col p-[16px] gap-[16px] ">
                                {groupDocument.length>0 ? (
                                  groupDocument.map((doc,index)=>{
                                    console.log(doc.link,'trying')
                                      return(
                                        <div className=" flex gap-[16px] ">
                                          <a  href={doc.link}><DoctIcon/></a>
                                          <p className=" relative top-1 flex gap-[6px] items-center ">{extractFileName(doc.link)}</p>  
                                        </div>
                                      )
                                    })
                                ):(
                                  <p>No Document is exchanged</p>
                                )}
                                  </div>
                              </div>
                            )}
                            {selectedMenu=="members" && (
                              <div>Common</div>
                            )}
                        </div>
                      </div>
                    )}
            <InfiniteScroll
              dataLength={chatMessage?.length || 0}
              next={fetchMoreChats}
              hasMore={hasMoreData}
              style={{ 
                display: 'flex', 
                flexDirection: 'column-reverse', // Ensure items are in reverse order
                overflowY: 'auto', // Enable vertical scrolling
                paddingBottom:"10px"
              }}
              loader={<ClassicSpinner/>}
              scrollableTarget="scrollableDiv"
              className=" "
              height={"72vh"}
            >
              <div id="scrollableDiv" className=" flex flex-col gap-[16px] relative ">
                {[...chatMessage].reverse().map((message, index) => {
                  const currentDate=new Date(message.createdAt).toLocaleDateString()
                  const storedDate=currentDate
                  
                  return (
                    <>
                    <div className=" flex justify-center items-center ">
                    <p className="bg-[#57585C] text-white text-[12px] leading-[18px] py-[6px] px-[16px] rounded-lg">
                    {currentDate==new Date().toLocaleDateString() ? "Today":currentDate}
                  </p>
                    </div>
                      <div
                        key={index}
                        ref={(el) => (messageRef.current[index] = el)}
                        data-id={message?._id}
                        className={` ${
                          message.sender?._id == userId &&
                          " flex-row-reverse "
                        }   mb-2 px-[24px] flex gap-[8px]  `}
                        onMouseEnter={() => setOpenMenuIndex(index)}
                        onMouseLeave={() => setOpenMenuIndex(null)}
                      >
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
                        <div className=" flex ">
                          <img
                            src={
                              message.sender?.pic ||
                              JSON.parse(localStorage.getItem("user"))?.pic
                            }
                            alt=""
                            className=" w-[32px] h-[32px] rounded-full "
                          />
                        </div>

                        <div
                          className={` ${
                            message.sender?._id == userId
                              ? "bg-[#DAE6F7]  rounded-tr-[2px]  "
                              : "bg-[#D7D7D8] rounded-tl-[2px]"
                          } relative p-[8px] pb-[6px] rounded-xl max-w-xl `}
                        >
                            
                              {!message.isDeleted ||
                              !message.isDeletedForEveryOne ? (
                                message?.replyTo && message?.replyMessage ? (
                                  <div className=" w-full ">
                                    <div className={`   ${message.sender?._id == userId ? "bg-[#EDF3FB] ": "bg-[#F2F3F5]"} w-full p-[8px] rounded-[8px]  `}>
                                      <p className=" font-medium text-base text-[#949494] ">
                                        {message?.sender.username}
                                      </p>
                                      <p className=" text-balance text-[#323236] ">
                                        {message?.replyMessage?.content}
                                      </p>
                                    </div>
                                    <p className="pr-[54px]  pt-[4px] px-[8px] pb-[6px]  ">
                                    {message?.content}
                                  </p>
                                  </div>
                                ) : (
                                  message?.content && (
                                    <p className=" last:mb-4 pr-[54px] pt-[4px] px-[8px] pb-[6px]  ">
                                    {message?.content}
                                  </p>
                                  )
                                )
                              ) : (
                                <p>Message is deleted</p>
                              )}
                            

                          {message.messageType == "application/pdf" && (
                            <div className={`${message.sender?._id == userId ? " ": ""} flex flex-col gap-[4px] `}>
                              <div className={` w-[240px] h-[120px] flex items-center justify-center rounded-[8px] ${message.sender?._id == userId ? "bg-[#EDF3FB] ": "bg-[#F2F3F5]"} `}><a  href={message.link}><DownloadIcon/></a></div>
                              <p className="flex gap-[6px] items-center  "><PDFIcon/> {extractFileName(message.link)}</p>                              
                            </div>
                          )}

                          {message?.messageType == "image/png" &&
                            message.link != null && (
                              <img
                                src={message.link}
                                alt="Uploaded file"
                                style={{ maxWidth: "100%", height: "auto" }}
                                className=" pb-[12px] "
                              />
                            )}

                          {message?.messageType == "application/msword" &&
                            message.link != null && (
                              <div className={`${message.sender?._id == userId ? " ": ""} flex flex-col gap-[4px] `}>
                              <div className={` w-[240px] h-[120px] flex items-center justify-center rounded-[8px] ${message.sender?._id == userId ? "bg-[#EDF3FB] ": "bg-[#F2F3F5]"} `}><a  href={message.link}><DownloadIcon/></a></div>
                              <p className=" xs flex gap-[6px] items-center h-[36px] "><ExcelIcon/> {extractFileName(message.link)}</p>                              
                            </div>
                            )}

                          {message?.messageType == "application/vnd.ms-excel" &&
                            message.link != null && (
                              <div className={`${message.sender?._id == userId ? " ": ""} flex flex-col gap-[4px] `}>
                              <div className={` w-[240px] h-[120px] flex items-center justify-center rounded-[8px] ${message.sender?._id == userId ? "bg-[#EDF3FB] ": "bg-[#F2F3F5]"} `}><a  href={message.link}><DownloadIcon/></a></div>
                              <p className=" flex gap-[6px] items-center h-[36px] "><ExcelIcon/> {extractFileName(message.link)}</p>                              
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

                          <p className=" absolute bottom-0 right-1 flex pl-[8px] gap-[4px] items-center ">
                            <span className=" text-[10px] leading-[15px] whitespace-nowrap ">
                              {formatTime(message.createdAt)}
                            </span>
                            <ReadIcon
                              iconColor={
                                message?.isReadByAll.length ===
                                groupChatRoom.users.length
                                  ? "#1600D0"
                                  : "#57585C"
                              }
                            />
                          </p>
                        </div>

                        {openMenuIndex == index && (
                          <Menu>
                            <MenuButton>
                              <DownArrow />
                            </MenuButton>
                            <MenuItems anchor="bottom right">
                              <div className=" bg-white w-[200px] border border-[#D7D7D8] rounded-3xl rounded-tl-[2px] cursor-pointer  ">
                                <MenuItem>
                                  <p
                                    className="flex gap-[12px] data-[focus]:bg-blue-100 hover:rounded-tr-3xl pt-[12px] pr-[24px] pb-[12px] pl-[16px] border-b border-[#D7D7D8] "
                                    onClick={() => {
                                      setReplyTo(message.sender?._id);
                                      setReplyMessage(message);
                                    }}
                                  >
                                    <AllChats /> Reply
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p className="flex gap-[12px] data-[focus]:bg-blue-100  pt-[12px] pr-[24px] pb-[12px] pl-[16px] border-b border-[#D7D7D8] ">
                                    <CopyIcon /> Copy
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="flex gap-[12px] data-[focus]:bg-blue-100  pt-[12px] pr-[24px] pb-[12px] pl-[16px] border-b border-[#D7D7D8] "
                                    onClick={() => {
                                      handleStarMessage(message, false);
                                    }}
                                  >
                                    <StarMessageIcon /> Star
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="flex gap-[12px] data-[focus]:bg-blue-100  pt-[12px] pr-[24px] pb-[12px] pl-[16px] border-b border-[#D7D7D8] "
                                    onClick={() => {
                                      handlePinMessage(message);
                                    }}
                                  >
                                    <PinIcon iconColor={message.isPinned ? "#1660CD":"#57585C" } /> {message.isPinned ? <span className=" text-[#1660CD] ">Unpin</span>:<span>Pin</span>}
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="flex gap-[12px] data-[focus]:bg-blue-100  pt-[12px] pr-[24px] pb-[12px] pl-[16px] border-b border-[#D7D7D8] "
                                    onClick={() => {
                                      setOpenDeleteModal(true);
                                      setSelectedMessage(message);
                                    }}
                                  >
                                    <TrashIcon /> Delete
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="flex gap-[12px] data-[focus]:bg-blue-100  pt-[12px] pr-[24px] pb-[12px] pl-[16px] border-b border-[#D7D7D8] "
                                    onClick={() => {
                                      setEditMessage(message);
                                      setNewMessage(message.content);
                                    }}
                                  >
                                    <DraftMessagesIcon /> Edit
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="flex gap-[12px] data-[focus]:bg-blue-100  pt-[12px] pr-[24px] pb-[12px] pl-[16px] border-b border-[#D7D7D8] "
                                    onClick={() => {
                                      setAllowSelect(true);
                                      setSelectMessage((prev) => {
                                        return [...prev, message];
                                      });
                                    }}
                                  >
                                    <SelectIcon /> Select
                                  </p>
                                </MenuItem>
                                <MenuItem>
                                  <p
                                    className="flex gap-[12px] data-[focus]:bg-blue-100 hover:rounded-b-3xl pt-[12px] pr-[24px] pb-[12px] pl-[16px]  "
                                    onClick={() => {
                                      setForward(true);
                                    }}
                                  >
                                    <ForwardIcon /> Forward
                                  </p>
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </Menu>
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </InfiniteScroll>
            <div className=" bg-white flex flex-col gap-[8px] absolute bottom-0 w-full py-[16px] px-[24px] border-t border-gray-300 rounded-b-2xl ">
              {replyMessage != null && (
                <div className=" flex justify-between w-full bg-[#D7D7D8] p-[8px] rounded-lg text-[#949497] ">
                  <div className="  ">
                    <p>{replyMessage?.sender.username}</p>
                    <p className=" text-[#323236] ">{replyMessage.content}</p>
                  </div>
                  <span
                    onClick={() => setReplyMessage(null)}
                    className=" cursor-pointer "
                  >
                    <CloseIcon />
                  </span>
                </div>
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

              <div className=" flex ">
                <div className=" w-full flex border border-[#D7D7D8] rounded-xl px-[16px] items-center">
                  <input
                    id="filePicker"
                    type="file"
                    accept=".pdf, .jpeg, .jpg, .png, .gif, .doc, .docx, .txt, .xls, .xlsx, .csv"
                    className="hidden" // Hide the file input element
                    onChange={(e) => handleFileUpload(e.target.files)} // Handle file upload
                  />
                  <input
                    className="outline-none w-full p-2 rounded-2xl"
                    value={newMessage}
                    onChange={(e) =>
                      handleMessageChange(e, false, groupChatRoom)
                    }
                    placeholder="Type a message"
                  />
                  <label htmlFor="filePicker" className="cursor-pointer">
                    <PaperClip />
                  </label>
                  <div
                    onClick={() => {
                      setOpenEmoji(!openEmoji);
                    }}
                  >
                    <p>
                      <EmojiIcon />
                    </p>
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
                </div>
                <button
                  onClick={sendMessage}
                  className="ml-2 text-white p-2 rounded-md"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className=" flex flex-col gap-[32px] w-full h-full bg-white rounded-3xl border border-[#D7D7D8] flex justify-center items-center ">
            <img src={NullImage} />
            <p className=" text-[22px] leading-[33px] font-semibold ">Start a conversation with your friends</p>
          </div>
        )}
      </div>

      {/* Discussion Room Modal */}
      <Transition appear show={openDiscussionModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-30 overflow-y-auto bg-[#16171C] bg-opacity-[48%]"
          onClose={() => setOpenDiscussionModal(false)}
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-lg font-bold">
                Create Discussion Room
              </DialogTitle>
              <div className="mt-2">
                <form>
                  <div>
                    <input
                      type="file"
                      accept=".jpeg, .jpg, .png"
                      onChange={(e) => {
                        handleGroupImage(e.target.files);
                      }}
                    />
                  </div>
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
                    <label className="block text-gray-700">
                      Enter Group Description
                    </label>
                    <input
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
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
          className="fixed inset-0 z-30 overflow-y-auto bg-[#16171C] bg-opacity-[48%]"
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
                <div className=" border-t border-[#57585C] flex gap-[24px] ">
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
          className="fixed inset-0 z-30 overflow-y-auto bg-[#16171C] bg-opacity-[48%]"
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
                                src={group.groupAdmin?.pic}
                                className=" w-[48px] h-[48px] rounded-full "
                              />
                              <div>
                                <p>{group?.users[1].username}</p>
                                <p>
                                  {draftMessages &&
                                  draftMessages[group?._id] ? (
                                    <p>
                                      Draft:{" "}
                                      {draftMessages[group?._id]?.draftMessage}
                                    </p>
                                  ) : (
                                    group?.latestMessage?.content
                                  )}
                                </p>
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
                                src={group.groupChatRoom.groupAdmin?.pic}
                                className="w-[48px] h-[48px] rounded-full"
                              />
                              <div>
                                <p>{group?.groupChatRoom?.chatName}</p>
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

      <Transition appear show={openExitRoomModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-30 overflow-y-auto bg-[#16171C] bg-opacity-[48%] "
          onClose={() => setExitRoomModal(false)}
        >
          <div className="flex min-h-screen items-center justify-center text-center">
            <DialogPanel className="w-full max-w-[414px] transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-lg font-bold">
                <div className=" flex justify-between py-[24px] px-[32px] ">
                <p className=" font-semibold text-[20px] leading-[32px] ">Exit Room</p>
                <span onClick={()=>setExitRoomModal(false)}><CrossIcon/></span>
                </div>
              </DialogTitle>
              <div className="">
                <Description>
                  <div className=" p-[32px] flex justify-center items-center text-center flex-col gap-[16px] border-y border-[#D7D7D8]  ">
                  <AlertIcon/>
                  <p className=" font-medium ">Are you sure<br/> want to exit “{groupChatRoom?.chatName}” room ?</p>
                  </div>
                </Description>
                <div className=" justify-center flex gap-[24px] py-[16px] px-[32px] ">
                <button onClick={()=>groupRemove()} className=" bg-[#FA1111] text-white py-[12px] px-[40px] rounded-2xl max-w-[131px] w-full max-h-[44px] flex justify-center items-center ">
                    Exit
                  </button>
                  <button onClick={()=>setExitRoomModal(false)} className=" border border-[#1660CD] text-[#1660CD] py-[12px] px-[40px] rounded-2xl max-w-[131px] max-h-[44px] flex justify-center items-center ">
                  Cancel 
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openReportRoomModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-aut0 bg-[#16171C] bg-opacity-[48%] "
          onClose={()=>{setReportRoomModal(false)}}
        >
          <div className="flex min-h-screen items-center justify-center text-center">
            <DialogPanel className="w-full max-w-[560px] transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3">
                <div className=" flex justify-between py-[24px] px-[32px] ">
                <p className=" font-semibold text-[20px] leading-[32px] ">Report Room</p>
                <span onClick={()=>setReportRoomModal(false)}><CrossIcon/></span>
                </div>
              </DialogTitle>
              <div className="">
                <Description>
                  <div className=" p-[32px] flex justify-center flex-col gap-[16px] border-y border-[#D7D7D8]  ">
                  <p className=" text-[#16171C] font-semibold ">Select Reason</p>
                  <div className=" flex gap-[12px] flex-col ">
                  {ReasonsToReport.map((reason, index) => (
                      <label key={index} className=" flex items-center text-[#57585C] ">
                        <input required type="checkbox" />
                        {reason}
                      </label>
                    ))}
                  </div>
                  </div>
                </Description>
                <div className=" justify-center flex gap-[24px] py-[16px] px-[32px] ">
                <button className=" bg-[#FA1111] text-white py-[12px] px-[40px] rounded-xl max-w-[186px] whitespace-nowrap w-full max-h-[44px] flex justify-center items-center ">
                  Report and Exit
                  </button>
                  <button onClick={()=>setReportRoomModal(false)} className=" border border-[#1660CD] text-[#1660CD] py-[12px] px-[40px] rounded-xl max-w-[131px] max-h-[44px] flex justify-center items-center ">
                  Cancel 
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openDeleteRoomModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-aut0 bg-[#16171C] bg-opacity-[48%] "
          onClose={()=>{setDeleteRoomModal(false)}}
        >
          <div className="flex min-h-screen items-center justify-center text-center">
            <DialogPanel className="w-full max-w-[560px] transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" className="text-lg font-bold">
                <div className=" flex justify-between py-[24px] px-[32px] ">
                <p className=" font-semibold text-[20px] leading-[32px] ">Delete Room</p>
                <span onClick={()=>setDeleteRoomModal(false)}><CrossIcon/></span>
                </div>
              </DialogTitle>
              <div className="">
                <Description>
                <div className=" p-[32px] flex justify-center items-center text-center flex-col gap-[16px] border-y border-[#D7D7D8]  ">
                  <AlertIcon/>
                  <p className=" font-medium ">Are you sure<br/> want to delete “{groupChatRoom?.chatName}” room ?</p>
                  </div>
                </Description>
                <div className=" justify-center flex gap-[24px] py-[16px] px-[32px] ">
                <button onClick={()=>deleteGroup()} className=" bg-[#FA1111] text-white py-[12px] px-[40px] rounded-xl max-w-[186px] whitespace-nowrap w-full max-h-[44px] flex justify-center items-center ">
                  Delete Group
                  </button>
                  <button onClick={()=>setDeleteRoomModal(false)} className=" border border-[#1660CD] text-[#1660CD] py-[12px] px-[40px] rounded-xl max-w-[131px] max-h-[44px] flex justify-center items-center ">
                  Cancel 
                  </button>
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
