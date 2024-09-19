const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/userSchema');  // Make sure this path is correct

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDocs = await User.findOne({ email });
        if (userDocs) {
            const passOk = bcrypt.compareSync(password, userDocs.password);
            if (passOk) {
                jwt.sign({
                    username: userDocs.username,
                    email: userDocs.email,
                    id: userDocs._id,
                }, process.env.JWT_SECRET, {}, (err, token) => {
                    if (err) throw err;                    
                    res.cookie('token', token).send({userDocs,token});
                });
            } else {
                res.status(422).json('Password incorrect');
            }
        } else {
            res.status(404).json('User not found');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json('Internal server error');
    }
});

const registerUser=asyncHandler(async(req,res)=>{
    const { username, password, email } = req.body;
    try {
        const bcryptPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username:username, password: bcryptPassword, email:email });
        const response=await newUser.save();
        jwt.sign({
            username:username,
            email:email,
            id:response
        },process.env.JWT_SECRET,{},(err,token)=>{
            if(err) throw err
            res.cookie('token',token,{httpOnly:true}).send('User Created')
        })
        res.status(200).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

const searchUser = asyncHandler(async (req, res) => {
    const searchQuery = req.query.search
    if (!searchQuery) {
      return res.status(200).send([])
    }
    const keyword = {
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
      ],
    };
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).send(users);
  });
  

module.exports = { authUser, registerUser, searchUser };
