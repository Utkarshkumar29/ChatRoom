const mongoose=require('mongoose')

const userSchema= new mongoose.Schema(
    {
        username:String,
        email:{
            type:String,
            unique:true,
        },
        password:String,
        pic:{
            type:String,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
        googleId: String, 
    },
    {
        timestamps:true
    }
)

const User=mongoose.model('User',userSchema)

module.exports = User;