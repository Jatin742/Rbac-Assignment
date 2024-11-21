const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter Event Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Event Name"],
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  numberOfRegisterations: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  timingOfEvent:{
    type: Date,
    default: Date.now
    // required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notified: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Event", eventSchema);