const express = require("express");
const userRouter = express.Router();
require("dotenv").config();
const { UserModel } = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRouter.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        bcrypt.hash(password,Number(process.env.SALT_ROUNDS),async(err,hash)=>{
            if(hash){
            const user = new UserModel({username, email, password:hash});
            await user.save();
            res.status(200).send({"msg":"new user has been registered"})  
            }else{
                res.send({"msg":"hash is missing",err})
            }

        })
    } catch (error) {
        res.send({err})
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user._id, author: user.username }, process.env.JWT_SECRET);
                    res.status(200).send({ "msg": "login success", "token": token });
                } else {
                    res.status(200).send({ "msg": "login failed", "err": err });
                }
            })
        }
        
    }catch (error) {
        res.send({err})
    }
    
})

module.exports = userRouter