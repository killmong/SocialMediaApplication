require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/user"); // Ensure the correct path to your User model

const jwtToken = process.env.JWT_TOKEN;
if (!jwtToken) {
  throw new Error("JWT_TOKEN environment variable is not set");
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization
  jwt.verify(token, jwtToken, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Invalid authorization token" });
    }
    const { _id } = payload;
    User.findById(_id)
      .then((userData) => {
        req.user = userData;
        next();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};
