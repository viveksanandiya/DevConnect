const express = require("express");
const { connectDb} = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();

//express has inbuilt middleware which converts JSON data into JS object so we dont need to
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
.then(()=>{ 
    console.log("db connect !")
    
    app.listen(7777, () => {
      console.log("server lsitening on port 7777 ");
    }); 
})
.catch((err)=>{
console.log("db connection err"+ err.message);
})

  
