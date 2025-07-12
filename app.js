const express = require('express');
const cors = require('cors');
const app = express();
const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messageController');

app.use(express.json({ limit: '10mb' }));

app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

// Use a Map to keep track of online users
let onlineUsersMap = new Map();

io.on('connection', (socket) => {
    socket.on('join-room', (userId) => {
        socket.join(userId);
    });

    socket.on('send-message', (message) => {
        io.to(message.members[0])
            .to(message.members[1])
            .emit('received-message', message);
    });

    socket.on('clear-unread-message', (data) => {
        io.to(data.members[0])
            .to(data.members[1])
            .emit('message-count-clear', { chatID: data.chatID });
    });

    socket.on('user-typing', (data) => {
        socket.broadcast.emit('started-typing', {
            chatID: data.chatID,
            sender: data.sender
        });
    });

    // User login: add user id to the onlineUsersMap and emit updated list
    socket.on('user-login', (user_id) => {
        onlineUsersMap.set(user_id, socket.id);
        io.emit('online-users', Array.from(onlineUsersMap.keys()));
    });

    // User logout: remove the user from the onlineUsersMap and emit updated list
    socket.on('user-logout', (user_id) => {
        onlineUsersMap.delete(user_id);
        io.emit('online-users', Array.from(onlineUsersMap.keys()));
    });

    // On disconnect: remove any matching socket id from the map and update online users
    socket.on('disconnect', () => {
        for (let [userId, id] of onlineUsersMap.entries()) {
            if (id === socket.id) {
                onlineUsersMap.delete(userId);
                break;
            }
        }
        io.emit('online-users', Array.from(onlineUsersMap.keys()));
    });
});

module.exports = server;
