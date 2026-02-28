const express = require("express");
const UserModel  = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const {z} = require("zod");
const jwt = require("jsonwebtoken")
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

authRouter.post("/signup", async (req, res) => {
  
    const zodSchema = z.object({
        firstName : z.string().min(2).max(50),
        password : z.string().min(5).max(50),
        lastName: z.string().optional(),
        emailId : z.string().email()
    })
 
    const parsedData = zodSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            message: "Incorrect format of data",
            error: parsedData.error
        });
    }
  
  try {
 
    const {emailId, password , firstName , lastName} = req.body;

    const userExist = await UserModel.findOne({emailId});

    if(userExist){
      res.status(409).json({message: "User already exist"});
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    //creating new instance of user model
    const user = new UserModel({
        firstName,
        lastName, 
        emailId,
        password: passwordHash
    });
    await user.save(); 
   res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const zodSchema = z.object({
        emailId: z.string().email(),
        password: z.string().min(5).max(50)
    });
    
    const parsedData = zodSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.status(400).json({
            message: "Incorrect format of data",
            error: parsedData.error.flatten(),
        })
        return
    }
  
  try {
    const { emailId, password } = parsedData.data;

    const existingUser =await UserModel.findOne({ emailId });
    if (!existingUser) {
      throw new Error("Invalid creds, please check your email or password");
    }
    //existingUser.password is from db
    const passwordMatch =await bcrypt.compare( password, existingUser.password);
 
    if( !passwordMatch){
      throw new Error("Invalid creds,  please check your email or password---");
    }

    const token = jwt.sign({
      _id: existingUser._id,
    }, JWT_SECRET,
  {
    expiresIn: "1hr" 
  });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });
    
res.json({ success: true, message: "Login successful!" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Logout successful!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = authRouter;
