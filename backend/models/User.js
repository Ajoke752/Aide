// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  pushToken: { type: String }, // For push notifications
});

mongoose.model("User", userSchema);
