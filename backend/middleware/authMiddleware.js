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
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});

module.exports = { protect };
