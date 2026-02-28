const express =  require("express");
const userAuth = require("../middleware/auth")
const requestRouter = express.Router();

requestRouter.post("/request/send", userAuth, async (req, res) => {
  try {
    
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = requestRouter; 