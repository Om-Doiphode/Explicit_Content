// Load environment variables from a .env file
require("dotenv").config();

// Import the required modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
app.use(cors());


// Connect to MongoDB server
const connectDB = require("./db/conn");
connectDB();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(express.json()); // Parse JSON bodies

// Create routes for authentication and image detection
app.use("/auth", require("./routes/auth"));
app.use("/image",require("./routes/content"));

// Start the server on port 3001
app.listen(3001, function () {
    console.log("Server started at port 3001");
  });