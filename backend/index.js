const express = require('express');
const app = express();
app.set("trust proxy", 1); //Important for deployment on Render (trust proxy for cookies & CORS)

const mongoose = require('mongoose');
const User = require('./Models/userSchema');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const chatData = require('./data');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { Server } = require('socket.io');
const Chat = require('./Models/chatModal');

require('dotenv').config();

//CORS config to allow frontend access
app.use(cors({
    origin: ["https://chat-room-fscl.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"],
}));

app.use(express.json());
app.use(cookieParser());

//MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://MERN:OabOhihuXOjL2fRB@cluster0.tiglnj5.mongodb.net/chats?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected");
}).catch((error) => {
    console.log("MongoDB Error:", error);
});

//Basic API check
app.get('/', (req, res) => {
    res.send("Hello World from Chat Server!");
});

//Route Handling
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);

//Dummy chat data test route
app.get("/chat/:id", (req, res) => {
    const relatedChats = chatData.find(c => c._id === req.params.id);
    res.send(relatedChats);
});

//Server start
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Socket.IO setup
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: ["https://chat-room-fscl.vercel.app", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

//Socket.IO event handlers
io.on("connection", (socket) => {
    console.log("New socket connection");

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
        if (Array.isArray(users)) {
            users.forEach(user => {
                if (user._id !== newMessageReceived.sender._id) {
                    io.to(user._id).emit('message received', newMessageReceived);
                }
            });
        }
    });

    socket.on('pinMessage', async (newPinMessageReceived) => {
        const { chat } = newPinMessageReceived;
        const ChatRoom = await Chat.findById(chat);
        if (Array.isArray(ChatRoom.users)) {
            ChatRoom.users.forEach(user => {
                const userId = user._id.toString();
                const senderId = newPinMessageReceived.sender;
                if (userId !== senderId) {
                    io.to(userId).emit('pinned message received', newPinMessageReceived);
                }
            });
        }
    });

    socket.on('unpinMessage', async (newPinMessageReceived) => {
        const { chat } = newPinMessageReceived;
        const ChatRoom = await Chat.findById(chat);
        if (Array.isArray(ChatRoom.users)) {
            ChatRoom.users.forEach(user => {
                const userId = user._id.toString();
                const senderId = newPinMessageReceived.sender;
                if (userId !== senderId) {
                    io.to(userId).emit('unpinned message', newPinMessageReceived);
                }
            });
        }
    });

    socket.on('messageDeleted', async (deleteMessage) => {
        const { chat } = deleteMessage;
        const ChatRoom = await Chat.findById(chat);
        if (Array.isArray(ChatRoom.users)) {
            ChatRoom.users.forEach(user => {
                const userId = user._id.toString();
                io.to(userId).emit('messageDeleted', deleteMessage);
            });
        }
    });
});
