const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const express = require("express");
const requestRouter = require("./request");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstname lastName gender age about skills photoUrl"

userRouter.get("/user/request/received", userAuth, async(req,res)=>{  
  try{
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
        message: `${loggedInUser.firstName} your connections fetched successfully`,
        data: connectionRequests
    }) 

  } catch(err){
    res.status(400).json({
        message: err.message,
    })
  } 
})

userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId : loggedInUser._id, status: "accepted"},
                {fromUserId : loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId" ,USER_SAFE_DATA ).populate("toUserId" ,USER_SAFE_DATA)


        const otherUserData = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){// mongo id cant be compared directly so made them string 
                return row.toUserId
            }
            else{
                return row.fromUserId
            }
        })

        res.json({
            data : otherUserData
        })

    }catch(err){
       res.status(400).json({
        message: err.message,
    }) 
    }
})

module.exports = userRouter
    
