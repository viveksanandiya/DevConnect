const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth")
const UserModel = require("../models/user");

profileRouter.get("/profile/view" ,userAuth ,async (req,res)=>{
    try{
        const user = req.user;
        console.log(user)

        const data = await UserModel.findById(user).select("-password");
        console.log(data);        
        res.send((data));

    }catch(err){
        res.status(400).send("Error " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        // if( !validateEditProfileData(req) ){
        //     return res.status(400).send("Invalid Edit request !!!")
        // }

        const userId = req.user;
        
        const updatedUser = await UserModel.findByIdAndUpdate({_id :userId}, {
            firstName : user.firstName,
            lastName : user.lastName,
            emailId : user.emailId,
            about : user.about,
            skills : user.skills

        }).select("-password").select("-isPremium");
        
        res.send(`${updatedUser.firstName}`+ " your data is updated" );

    } catch (err) {
        res.status(400).send("Error " + err.message);
    }
});
 
module.exports = profileRouter;
 

