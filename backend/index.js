const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./Models/userSchema'); // Assuming userSchema.js is in Models directory
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const chatData = require('./data'); // Replace with actual path if needed
const userRoutes = require('./routes/userRoutes'); // Assuming routes are in routes directory
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { Server } = require('socket.io');
const Chat = require('./Models/chatModal');

require('dotenv').config();

app.use(express.json());
app.use(cors({
    origin: ["https://chat-room-fscl.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"],
}));
 
  
app.use(cookieParser());

mongoose.connect('mongodb+srv://MERN:OabOhihuXOjL2fRB@cluster0.tiglnj5.mongodb.net/chats?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected");
}).catch((error) => {
    console.log(error);
});


app.get('/', (req, res) => {
    res.send("Hello World");
});

// Route Handling
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);

// Chat data example route
app.get("/chat/:id", (req, res) => {
    const relatedChats = chatData.find(c => c._id === req.params.id);
    res.send(relatedChats);
});

const PORT = process.env.PORT || 5000; 
// Server and Socket.IO Initialization
const server = app.listen(PORT, () => {
    console.log("Server running on port 5000");
});

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chat-room-fscl.vercel.app"
    }
});

// Socket.IO Event Handling
io.on("connection", (socket) => {
    

    socket.on("setup", (userData) => {
        if (userData && userData._id) {
            socket.join(userData._id);
            socket.emit("connected");
            console.log(`User ${userData._id} joined room.`);
        }
    });

    socket.on("join chat", (room) => {
        console.log(`Socket ${socket.id} joining room: ${room}`);
        socket.join(room);
    });

    socket.on('newMessage', (newMessageReceived) => {
        console.log("New message received:", newMessageReceived);
        const chat = newMessageReceived.chat;
        const users = chat.users;
        console.log('Chat users:', users);

        if (Array.isArray(users)) {
            users.forEach(user => {
                if (user._id !== newMessageReceived.sender._id) {
                    console.log(`Emitting to user ${user._id}`);
                    io.to(user._id).emit('message received', newMessageReceived);
                }
            });
        }
    });

    socket.on('pinMessage',async(newPinMessageReceived)=>{
        const { chat } = newPinMessageReceived
        const ChatRoom = await Chat.findById(chat);
        console.log(ChatRoom,newPinMessageReceived)
        if (Array.isArray(ChatRoom.users)) {
            ChatRoom.users.forEach(user => {
                const userId = user._id.toString();
                const senderId = newPinMessageReceived.sender;
                if (userId !== senderId) {
                    console.log(`Emitting to user ${userId}`);
                    io.to(userId).emit('pinned message received', newPinMessageReceived);
                }
            });
        }
    })

    socket.on('unpinMessage',async(newPinMessageReceived)=>{
        const { chat } = newPinMessageReceived
        const ChatRoom = await Chat.findById(chat);
        if (Array.isArray(ChatRoom.users)) {
            ChatRoom.users.forEach(user => {
                const userId = user._id.toString();
                const senderId = newPinMessageReceived.sender;
                if (userId !== senderId) {
                    console.log(`Emitting to user ${userId}`);
                    io.to(userId).emit('unpinned message', newPinMessageReceived);
                }
            });
        }
    })

    socket.on('messageDeleted',async(deleteMessage)=>{
        console.log(deleteMessage)
        const { chat } = deleteMessage
        const ChatRoom = await Chat.findById(chat);
        if (Array.isArray(ChatRoom.users)) {
            ChatRoom.users.forEach((user)=>{
                const userId = user._id.toString();
                console.log(`Emitting to user ${userId}`);
                io.to(userId).emit('messageDeleted', deleteMessage);
            })
        }
    })
});
