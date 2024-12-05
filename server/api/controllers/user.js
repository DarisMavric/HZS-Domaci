import mongoose from "mongoose"
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const regUser = async(req,res) => {
    const {firstName,lastName,username,email,password,interests} = req.body;
    if(!password || !firstName || !lastName || !email || !interests || !username) {
        return res.status(400).json('You should fill all the fields') 
    } 
    const userAvailable = await User.findOne({email});
    if(userAvailable) {
        return res.status(400).json('User already registered!');
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({
        firstName,
        lastName,
        username,
        interests,
        email,
        passwordHash: hashedPassword
    })


    if(user){
        const data = {
            _id: user._id,
            interests: user.interests
        }
        const token = jwt.sign({ id: user._id }, "secretkey");
        res.cookie("accessToken", token);
        res.status(200).json(data);
    } else {
        return res.status(400).json('User data is not valid');
        console.log('Eror')
    }
    
}

export const logUser = async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password) {
        return res.status(400).json('All fields are mandatory')
    } 
    const user = await User.findOne({email})
    if(user) {
        const checkPassword = bcrypt.compare(
            req.body.password,
            user.passwordHash
        );
        if(checkPassword) {
            const data = {
                _id: user._id,
                interests: user.interests
            }
            const token = jwt.sign({ id: user._id }, "secretkey");
            res.cookie("accessToken", token);
            res.status(200).json(data);
        } else {
            return res.status(400).json('Incorrect password')
        }
    } else {
        return res.status(400).json('User does not exist!');
    }
}

export const getUsers = async(req,res) => {
    const user = await User.find()
    if(user) {
        return res.status(200).json(user);
    } else {
        return res.status(400).json('User does not exist!');
    }
}

export const logOut = async(req,res) => {
    res.clearCookie('accessToken');
    return res.status(200).json("Cookies deleted");
}