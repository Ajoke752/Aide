// models/Medicine.js
const mongoose = require("mongoose");
require("./User");

const medicineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, default: "Medicine" }, // We'll try to get this from the LLM
  photoUrl: { type: String, required: true },
  schedule: [
    {
      time: { type: String, enum: ["morning", "afternoon", "evening"] },
      dose: { type: Number, default: 1 },
    },
  ],
  logs: [
    {
      scheduledTime: { type: String },
      takenAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

mongoose.model("Medicine", medicineSchema);
