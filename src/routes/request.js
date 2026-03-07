const express = require("express");
const { userAuth } = require("../middleware/auth");
const requestRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //isUserExist is check if toUserId exist in db ?
      const toUserIdExist = await User.findById(toUserId);

      if (!toUserIdExist) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      //allowing just sender status not receiver status like accepted, rejected
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.json({
          message: "Wrong status sent",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.json({
          message: "Connection Request exist",
        });
      }

      //check if user is not sending req to himself
      if (fromUserId == toUserId) {
        return res.json({
          message: "making request to yourself , are you comedy me ?",
        });
      }

      const makingConnection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await makingConnection.save();
      res.status(200).json({
        message: `${req.user.firstName} your Connnection ${status} to send successfully ! `,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
);

requestRouter.post("/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      
      //logged in user is toUser and NOT fromUser
      const loggedInUserId = req.user._id;
      //requestid is not id of any user its id of connect which is made in db for any 2 users
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowedStatus = ["accepted", "rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({
          message: "Status not found"
        })
      }

      //if sender is interested then only receiver can accept/reject
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId : loggedInUserId,
        status: "interested"
      });

      if(!connectionRequest){
        return res.status(404).json({
          message: "Connection Req not found"
        })
      }

      //if connectRequest exist then change it according to receiver accept/reject
      connectionRequest.status = status ; //status is from params

      await connectionRequest.save();

    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
);

module.exports = requestRouter;
