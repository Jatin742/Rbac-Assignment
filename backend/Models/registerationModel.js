const mongoose = require("mongoose");

const registerationSchema = mongoose.Schema({
    event:{
        type: mongoose.Schema.ObjectId,
        ref: "Event",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
});

module.exports = mongoose.model("Registeration", registerationSchema);