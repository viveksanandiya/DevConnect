const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth")
const User = require("../models/user");
const {z} = require("zod");

profileRouter.get("/profile/view" ,userAuth ,async (req,res)=>{
    try{
        const user = req.user;

        const data = await User.findById(user._id).select("-password");
           
        res.send((data));

    }catch(err){
        res.status(400).json({ success: false, message: err.message });    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    const editSchema = z.object({
        firstName: z.string().min(2).max(50).optional(),
        lastName: z.string().optional(),
        about: z.string().max(300).optional(),
        skills: z.array(z.string()).optional(),
        photoUrl: z.string().url().optional(),
        age: z.number().min(18).optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
  });
  
    const parsedData = editSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid data",
      error: parsedData.error.flatten(),
    });
  }

    try {
        const userId = req.user._id;
        
        const {firstName, lastName, about, skills, age, gender} = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            about, 
            skills,
            about,
            age,
            gender

        },
    {new: true}).select("-password -isPremium");
        
res.json({
      success: true,
      message: `${updatedUser.firstName}, your profile has been updated!`,
      data: updatedUser,
    });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});


profileRouter.patch("/profile/password", userAuth, async (req,res)=>{
    const editSchema = z.object({
        password : z.string().min(5).max(50)
    });

    const parsedData = editSchema.safeParse(req.body);
    if( !parsedData.success){
        return res.status(400).json({
            message: "Invalid data",
            error: parsedData.error.flatten(),
        });
    }

    try{
        const userId = req.user._id;
        const {password} = req.body;

        const updatedData = await User.findOneAndUpdate(userId,{
            password
        },{new: true})

        res.status(200).json({
            success: true,
            message: `${updatedData.firstName} your password is updated successfully !`
        })


    }catch(err){
         res.status(400).json({
            success: false,
            message: err.message
        });
    }
});
 
module.exports = profileRouter;
 

