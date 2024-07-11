require("dotenv").config();
const express = require("express");
const User = require("../model/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtToken = process.env.Jwt_token;


// Post Method
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const savedUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userdata = new User({
      email,
      password: hashedPassword,
      username,
    });

    const dataToSave = await userdata.save();
    res.status(201).json(dataToSave);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Get all Method
router.get("/get/user", async (req, res) => {
  try {
    const dataToShow = await User.find();
    if (!dataToShow || dataToShow.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json(dataToShow);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Get by ID Method
router.get("/getuser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const dataToShow = await User.findById(id);
    if (!dataToShow) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json(dataToShow);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Update by ID Method
router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { username, avatar } = req.body;

  // Validate the new username
  if (username) {
    const userExists = await User.findOne({ username: username });
    if (userExists) {
      return res.status(422).json({ error: "Username already exists" });
    }
  }

  try {
    const updatedData = {};
    if (username) updatedData.username = username;
    if (avatar) updatedData.avatar = avatar;

    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, updatedData, options);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Delete by ID Method
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide both email and password" });
  }

  try {
    const savedUser = await User.findOne({ email: email });

    if (!savedUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, savedUser.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // JWT token generation
    const token = jwt.sign({ _id: savedUser._id }, jwtToken, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 36000, // 1 hour
    });
    res.status(200).json({ message: "Signin successful", token });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//signout
router.get("/signout", (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Signout successful" });
});

module.exports = router;
