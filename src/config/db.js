const mongoose = require('mongoose');
require("dotenv").config();

connectDb = async()=>{
    await mongoose.connect(process.env.MONGO_URL);
};

module.exports= {
    connectDb
}



