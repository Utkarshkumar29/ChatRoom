import { useEffect, useRef, useState, useContext } from "react";
import io from 'socket.io-client';
import axios from "axios";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";

const ChatRoom = () => {
    const ENDPOINT = "http://localhost:5000";
    const socket = useRef(null);
    const { user } = useContext(UserContext);

    const [userList, setUserList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [chatroomMessages, setChatroomMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [chatId, setChatId] = useState("");

    // Initialize socket connection and set up listeners
    useEffect(() => {
        socket.current = io(ENDPOINT);

        socket.current.on('connection', () => {
            setSocketConnected(true);
        });

        socket.current.emit("setup", user);

        // Clean up on component unmount
        return () => {
            socket.current.disconnect();
        };
    }, [ENDPOINT, user]);

    // Handle incoming messages
    useEffect(() => {
        const handleMessageReceived = (newMessageReceived) => {
            console.log('Message received:', newMessageReceived?.chat?._id, chatId);
            if (chatId && chatId === newMessageReceived?.chat?._id) {
                setChatroomMessages(prevMessages => [...prevMessages, newMessageReceived]);
                console.log(chatroomMessages, 'rain');
            } else {
                console.log("Message received in a different chat.");
            }
        };

        socket.current.on('message received', handleMessageReceived);

        // Clean up listener on component unmount or chatId change
        return () => {
            socket.current.off('message received', handleMessageReceived);
        };
    }, [chatId]);

    // Fetch chatroom messages
    useEffect(() => {
        if (chatId) {
            const fetchChatroomMessages = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.get(`/api/message/${chatId}`);
                    const messages = Array.isArray(response.data) ? response.data : []; // Ensure it's an array
                    setChatroomMessages(messages);
                } catch (error) {
                    console.error('Error fetching chatroom messages:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchChatroomMessages();
            socket.current.emit("join chat", chatId);
        }
    }, [chatId]);

    // Handle user search
    const handleSearch = async (keyword) => {
        try {
            const response = await axios.get(`/api/user?search=${keyword}`);
            console.log('User search response:', response.data);
            setUserList(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    // Check and create chat with a user
    const checkAndCreateChat = async (user) => {
        setSelectedChat(user);
        try {
            const response = await axios.post('/api/chats', { userId: user?._id });
            console.log('Chat response:', response.data);
            setChatId(response.data?._id);
            socket.current.emit("join chat", response.data?._id);
        } catch (error) {
            console.error('Error checking or creating chat:', error);
        }
    };

    // Handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            if (selectedChat) {
                const response = await axios.post('/api/message', {
                    chatId: chatId,
                    content: newMessage
                });
                console.log('Message sent response:', response.data);
                setChatroomMessages(prevMessages => [...prevMessages, response.data]);
                socket.current.emit('newMessage', response.data);
                setNewMessage(""); // Clear the message input after sending
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Access chats for the user
    const accessChats = async () => {
        try {
            const response = await axios.get('/api/chats', { params: { userId: user?._id } });
            console.log('Chats response:', response.data);
        } catch (error) {
            console.error('Error accessing chats:', error);
        }
    };

    useEffect(() => {
        accessChats();
    }, [user?._id]);

    return (
        <div className="flex w-full h-screen justify-center items-center">
            <div className="flex flex-col flex-1 w-full h-full bg-lime-100">
                <div className=" w-full flex justify-center items-center gap-[24px] ">
                    <p>Message</p>
                    <Link to="/discussions">Discussions</Link>
                </div>
                <p>Search Users {user?.username}</p>
                <input placeholder="Search User" onChange={(e) => handleSearch(e.target.value)} className="outline-none border border-t-neutral-950" />
                <div className="text-black">
                    {userList.map((user, index) => (
                        <div key={index} className="hover:bg-slate-400 transition" onClick={() => checkAndCreateChat(user)}>
                            <img src={user?.pic} className="w-[24px] h-[24px] rounded-full" />
                            <p>{user?.username}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-1 flex-col bg-teal-50 h-full w-full p-[32px]">
                <p>{selectedChat?.username}</p>
                <div className="relative h-[95vh] p-[32px] bg-emerald-200">
                    <div>
                        {isLoading ? (
                            <p>Loading....</p>
                        ) : (
                            chatroomMessages?.map((message, index) => (
                                <p key={index}>{message?.content}</p>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleSendMessage}>
                        <div className="absolute bottom-0 w-full flex gap-[24px]">
                            <input className="w-5/6" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                            <button type="submit">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
