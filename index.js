require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const user = require("./routes/user");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api", user);


// Define your API routes
app.post('/user/signup', (req, res) => {
  // Your signup logic here
  res.json({ message: 'Signup successful' });
});
// Define your API routes

// Root Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// MongoDB connection
mongoose
  .connect(process.env.SNOWFLAKE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Connection events
mongoose.connection.on("connected", () => {
  console.log("connected");
});

mongoose.connection.on("error", () => {
  console.log("error! not connected");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
