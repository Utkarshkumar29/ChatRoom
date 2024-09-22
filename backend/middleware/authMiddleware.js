const jwt=require('jsonwebtoken')
const asyncHandler=require('express-async-handler')
const User=require('../Models/userSchema')
require('dotenv').config()
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const protect = asyncHandler(async (req, res, next) => {
    // Get token from Authorization header
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
        ? req.headers.authorization.split(' ')[1] 
        : null;

    if (!token) {
        res.status(401).send("Not authorized, please log in");
        throw new Error("Not authorized");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log decoded token
        req.user = await User.findById(decoded.id).select("-password");
        console.log('User Found:', req.user); // Log user information
        next();
    } catch (error) {
        console.error(error); // Log error details
        res.status(401).json({ message: "Not authorized, token failed" });
        throw new Error("Not authorized, token failed");
    }
});

module.exports = { protect };