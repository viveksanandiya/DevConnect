const mongoose = require('mongoose');

connectDb = async()=>{
    await mongoose.connect("mongodb+srv://viveksanandiya787:UaAy8DMmV2JTdhrz@cluster0.7f2f6.mongodb.net/devTinder");
};

module.exports= {
    connectDb
}



