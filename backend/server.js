// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); // <-- FIX: This should be "mongoose"
const cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const path = require("path");

// Import your services and routes
require("./services/mongo"); // Connects to MongoDB

// --- THIS IS THE FIX ---
// Load your models first, so other files can find them.
require("./models/User");
require("./models/Medicine");
// ---------------------

require("./services/passport"); // Now this will work!
const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Allow React
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.COOKIE_KEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/auth", authRoutes);
app.use("/api/medicine", medicineRoutes);

// Serve static files (for your /uploads folder)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- (Add cron job logic here later) ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
