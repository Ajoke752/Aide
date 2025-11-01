// routes/authRoutes.js
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// 1. The button click: Redirects user to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. The callback: Google redirects back to us
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // This is where you would set a cookie or JWT
    // For a hackathon, just redirecting with success is fine.
    // React will now be able to hit /api/current_user
    res.redirect("http://localhost:3000/dashboard"); // Redirect to React app
  }
);

router.get("/current_user", (req, res) => {
  res.send(req.user); // Send user data to React
});

router.get("/logout", (req, res) => {
  req.logout(); // Kills the session
  res.redirect("http://localhost:3000/");
});

module.exports = router;
