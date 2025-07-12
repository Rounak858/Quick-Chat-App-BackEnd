const route = require('express').Router();
// const { response } = require('../app');
const authMiddleware = require('./../middlewares/authMiddleware');
const Chat = require('./../models/chat');
const message = require('./../models/message');

route.post('/new-message',authMiddleware,async (req,response) => {
    try{
        //store the message in message collection
        const newMessage = new message(req.body);
        const saveMessage = await newMessage.save();
    
        //update the last messages
        await Chat.findOneAndUpdate({
            _id: req.body.chatID
        },{
            lastMessage: saveMessage._id,
            $inc: {unreadMessageCount: 1}
        });
        response.status(201).send({
            message:'Message sent successfully',
            success: true,
            data: saveMessage
        })
    } catch(error) {
        response.status(400).send({
            message: error.message,
            success: false
        });
    }
})
route.get('/get-all-messages/:chatID',authMiddleware,async (req,response) => {
    try {
        const allMessages = await message.find({chatID: req.params.chatID}).sort({createdAt:1});
        response.send({
            message: 'message fetched successfully',
            success: true,
            data: allMessages
        });

    } catch(error) {
        response.status(400).send({
            message: error.message,
            success: false
        });
    }
})
module.exports = route; 
