const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = "vivek@123";

const adminAuth = async (req, res, next) => {
  try{
    const token = req.cookies.token;
  if (!token) {
      throw new Error("Not a Vaid token !!");
    }

    
    const deocodedObj = await jwt.verify(token, JWT_SECRET);
    const { _id } = deocodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Not a Vaid token !!");
    }

    const deocoded = jwt.verify(token, JWT_SECRET);
    const { _id } = deocoded;

    const userId = await User.findById(_id);
    if (!userId) {
      throw new Error("User Not Found");
    }
    req.user = userId;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
