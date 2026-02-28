const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET;
require("dotenv").config();
 

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token not found , please login");
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);

    const _id = decoded._id ;
    const user = await UserModel.findById(_id);
    console.log("found user:-" , user);

    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

module.exports = {
  userAuth,
};
