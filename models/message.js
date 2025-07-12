const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    },
    sender: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    },
    text: {
        type: String,
        reqired: true
    },
    image: {
        type: String,
        required: false
    },
    read: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

module.exports = mongoose.model('message',messageSchema);