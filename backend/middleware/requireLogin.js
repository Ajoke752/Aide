// middleware/requireLogin.js
module.exports = (req, res, next) => {
  // passport.js attaches the 'user' object to the request (req)
  // if they are logged in.
  if (!req.user) {
    // If there is no user, send an "Unauthorized" error
    return res.status(401).send({ error: "You must log in!" });
  }

  // If there is a user, everything is good!
  // 'next()' tells Express to continue to the actual route
  next();
};
