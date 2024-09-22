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
        console.log(token)
    if (!token) {
        res.status(401).send("Not authorized, please log in");
        throw new Error("Not authorized");
    }

    try {
        
        console.log(token)
        next();
    } catch (error) {
        console.error(error); // Log error details
        res.status(401).json({ message: `Not authorized, toke:${token} failed`,token,decoded });
        
    }
});

module.exports = { protect };