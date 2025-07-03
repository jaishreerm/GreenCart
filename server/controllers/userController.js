// how user is going to Register and Login , this will be done in userController.js

import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import { response } from "express";
import jwt from 'jsonwebtoken';


// Register User : /api/user/register
export const register = async (req,res)=>{
    try{
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const existingUser = await User.findOne({email}) // if any existingUser with this email is already avialable we will not create the account

        if(existingUser)
            return res.json({success: false, message: 'USer already exists'})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, password: hashedPassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        
        res.cookie('token', token, {
            httpOnly: true, // prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7*24*60*1000, // Cookie expiration time
        })

        return res.json({success: true, user: {email:user.email, name: user.name}})
    } catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// IF ANY ERROR OCCURS IN try BLOCK THEN cath BLOCK WILL BE EXECUTED


// Login User : /api/user/login
// if any account already registered now they have to only Login

export const login = async(req, res)=> {
    try {
        const {email, password} = req.body;

        if(!email || !password) // while Logining give email and password both
            return res.json({success: false, message: 'Email and password are required'});
        // suppose we have entered the email also and password also, then we will verify whether the input email and password matches from the saved one in the database

        const user = await User.findOne({email}); // 1st verify the email, find the user using email
        if(!user){ // if no user exists with the above email
            return res.json({success: false, message: 'Invalid email'});
        }

        // if email matched, so we will match the password now, whether the password while Logining is same as saved one while registering 
        const isMatch = await bcrypt.compare(password, user.password) // password will now match with user.password
        if(!isMatch){
            return res.json({success: false, message: 'Invalid Password'});
        }
        // If the password also matches, we will generate a token. When the user logs in, we will give them a token that will be stored in the user's browser, and whenever the user makes a request again, that token will be automatically sent and verified by the server
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7*24*60*1000, 
        })

        return res.json({success: true, user: {email:user.email, name: user.name}}) //now if everything is fine with Login, print this as response
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
}
}

// create a function to check whether the user is authanticated or not
// Check Auth : /api/user/is-auth
export const isAuth = async(req, res)=>{
    try {
        const { userId } = req; // don't do req.body, req.body is only defined for POST/PUT/PATCH requests, so don't do for 🚫GET fn
        const user = await User.findById(userId).select("-password") // from this user data we want to execute password data
        return res.json({success: true, user}) // now if everything is fine with isAuth, print this as response
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Logout User: /api/user/logout
export const logout = async(req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
        });
        return res.json({success: true, message: 'Logged Out'}); 
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }

}