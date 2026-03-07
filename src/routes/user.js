const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const express = require("express");
const User = require("../models/user");
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

userRouter.get("/feed", userAuth, async(req,res)=>{
//user should not see himself, he ignored , interested(sent connection req) , connections (got accepted) , got rejected
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page-1)*limit;

        const usersToNotAddInFeed = await ConnectionRequest.find({
            $or :[
                { fromUserId : loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        })

        const hideUsersFromFeed = new Set();

        usersToNotAddInFeed.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        
        const users = await User.find({
            $and:[
                //users NOT-IN usersToNotAddInFeed array to be fetched
                { _id: {$nin: Array.from(hideUsersFromFeed)} },

                //user's own id should not be in feed 
                {_id: {$ne: loggedInUser._id} }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        //fetching only required fields 
        //skip-> skips previous users & limit ->limits the no of users fetched at a time
        
        res.json({
            data : users
        })

    }catch(err){
        res.status(400).json({
        message: err.message,
    }) 
    }
})

module.exports = userRouter
    
