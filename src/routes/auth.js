const express = require("express");
const UserModel  = require("../models/user");
const bcrypt = require("bcrypt");
const {validateSignupData } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validate data , i have not used zod and used validator in this project
    validateSignupData(req);

    const {emailId, password , firstName , lastName} = req.body;


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
    res.status(400).send("Error !!!! " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user =await UserModel.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid creds, no user");
    }
    
    const isPassword = await user.validatePassword(password);
    
    if (!isPassword) {
      throw new Error("invalid creds passsword");
    }
    
    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });

    
    res.send("login successful !");
  } catch (err) {
    res.status(400).send("Error caught " + err.message);
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
