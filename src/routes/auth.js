const express = require("express");
const UserModel  = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const {z} = require("zod");
const jwt = require("jsonwebtoken")
const JWT_USER_PASSWORD = "vivek@123";

authRouter.post("/signup", async (req, res) => {
  
    const zodSchema = z.object({
        firstName : z.string().min(2).max(50),
        password : z.string().min(5).max(50),
        lastName: z.string(),
        emailId : z.email()
    })
 
    const parsedData = zodSchema.safeParse(req.body);

    if(!parsedData.success){
        console.log("bad data")
        res.json({
            message: "incorrect format of data",
            error: parsedData.error
        })
        return
    }
  
  try {
 
    const {emailId, password , firstName , lastName} = req.body;

    const userExist = await UserModel.findOne({emailId});

    if(userExist){
      res.status().json({message: "User exist"});
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
    res.send("User added succefully !");

  } catch (err) {
    res.status(400).json({
      success : false,
      message : err.message
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const zodSchema = z.object({
        emailId: z.email(),
        password: z.string().min(5).max(50)
    });
    
    const parsedData = zodSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.json({
            message: "incorrect format of data",
            error: parsedData.error
        })
        return
    }
  
  try {
    const { emailId, password } = req.body;

    const existingUser =await UserModel.findOne({ emailId });
    if (!existingUser) {
      throw new Error("Invalid creds, please check your email or password");
    }

    const dbPassword = existingUser.password;

    const passwordMatch =await bcrypt.compare( password,dbPassword);
 
    if( !passwordMatch){
      throw new Error("Invalid creds,  please check your email or password---");
    }

    const token = jwt.sign({
      id: existingUser._id,
    }, JWT_USER_PASSWORD);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });
    
    res.send("login successful !");
  } catch (err) {
    res.status(400).send("Error caught ?? " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("logout successful !");
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = authRouter;
