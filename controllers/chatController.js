const router = require('express').Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../models/chat');
const Message = require('./../models/message');

router.post('/create-new-chat', authMiddleware, async (req, respose) => {
    try {
        const chat = new Chat(req.body);
        const savedChat = await chat.save();
        await savedChat.populate('members').execPopulate();
        respose.status(201).send({
            message: 'chat created successfully',
            success: true,
            data: savedChat
        })

    } catch (error) {
        respose.status(400).send({
            message: error.message,
            success: false
        });
    }
});

router.get('/get-all-chats', authMiddleware, async (req, respose) => {
    try {
        const allChats = await Chat.find({ members: { $in: req.userID } })
            .populate('members')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });
        respose.status(200).send({
            message: 'chat fetched successfully',
            success: true,
            data: allChats
        })

    } catch (error) {
        respose.status(400).send({
            message: error.message,
            success: false
        });
    }
});

router.post('/clear-unread-message', authMiddleware, async (req, respose) => {
    try {
        const chatId = req.body.chatID;
        //we want to update the unreadmessage count in chat collection
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return respose.send({
                message: "no chat found",
                success: false
            })
        }
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { unreadMessageCount: 0 },
            { new: true }
        ).populate('members').populate('lastMessage');
        // we want to update the read property to true in message colection
        await Message.updateMany(
            { chatID: chatId, read: false },
            { read: true }
        );
        respose.send ({
            message: "unread message cleared successfully",
            success:true,
            data: updatedChat
        });
    } catch (error) {
        respose.status(400).send({
            message: error.message,
            success: false
        });
    }
})
module.exports = router;