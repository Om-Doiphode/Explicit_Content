// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchuser");

// Secret key for signing and verifying JWTs
const JWT_SECRET = "Sucrose";

// Route1: To create a new user
router.post(
  "/createUser",
  [
        // Validation checks for the request body
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    console.log(req.body);

    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Respond with 400 status and validation errors if validation fails
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // Check whether a user with this email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
          // Respond with 400 status if user already exists
        return res
          .status(400)
          .json({ success, error: "A user with this email already exists" });
      }

      // Generate a salt and hash the password using bcrypt
      const salt = await bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hashSync(req.body.password, salt);
      
      // Create a new user with the provided details
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      // Generate a JWT token for the user's session
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      // Log the generated authToken
      console.log({ authToken });

      // Set success to true and respond with the authToken
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      // Log errors and respond with a 500 status in case of an internal server error
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

// Route2: For user login
router.post(
  "/login",
  [
    // Validation checks for the request body
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure email and password from the request body
    const { email, password } = req.body;
    try {
      // Check if a user with the provided email exists
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      // Compare the provided password with the hashed password in the database
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      // Generate a JWT token for the user's session
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      // Set success to true and respond with the authToken
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      // Log errors and respond with a 500 status in case of an internal server error
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: To get user details: Login is required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    // Extract the user id from the authenticated user's request object
    let userId = req.user.id;

    // Retrieve user details from the database by user id (excluding password)
    const user = await User.findById(userId).select("-password");

    // Respond with the user details
    res.send(user);
  } catch (error) {
    // Log errors and respond with a 500 status in case of an internal server error
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Export the router for use in other parts of the application
module.exports = router;