require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const user = require("./routes/user");
const post = require("./routes/post");
const app = express();
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
const cors = require("cors");
const story = require("./model/story");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Use cookie-parser middleware
app.use(cookieParser());
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api", user);
app.use("/api", post);
app.use("/api",story);

// Root Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

//MongoDB connection
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
