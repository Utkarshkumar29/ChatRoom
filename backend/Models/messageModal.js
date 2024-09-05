const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            trim: true
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        },
        replyTo:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        messageType:{
            type:String
        },
        link:{
            type:String
        },
        isDeleted:{
            type:Boolean    
        },
        isDeletedForEveryOne:{
            type:Boolean
        },
        isPinned:{
            type:Boolean
        },
        isStarred:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }],
        isReadByAll:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
