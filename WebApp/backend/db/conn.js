// Import the Mongoose library for MongoDB interaction
const mongoose = require("mongoose");

// Load environment variables from a .env file
require("dotenv").config();

// Define a function to connect to the MongoDB database
const connectDB = async () => {
  try {
  // Attempt to connect to the MongoDB database using the URL from the environment variables
  await mongoose.connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true, // Use the new Server Discovery and Monitoring engine
    useNewUrlParser: true, // Use the new URL parser
  });
    // Log a success message if the connection is established
    console.log("database connected...");
  } catch (err) {
    // Log an error message if there is an issue connecting to the database
    console.error(err);
  }
};

// Export the connectDB function to be used in other parts of the application
module.exports = connectDB;