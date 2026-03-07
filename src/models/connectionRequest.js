const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref:"User"
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "ignored"]   
        }
    }

},
{
    timestamps:true
});

//index will make db query faster
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest