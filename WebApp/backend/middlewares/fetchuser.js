// Import the 'jsonwebtoken' library for handling JSON Web Tokens (JWT)
const jwt = require("jsonwebtoken");

// Secret key used for signing and verifying JWTs
const JWT_SECRET = "Sucrose";

// Middleware function to fetch user information from a JWT token
const fetchuser = (req, res, next) => {
    // Extract the token from the 'auth-token' header in the HTTP request
  const token = req.header("auth-token");

    // Check if the token is missing or invalid
  if (!token) {
    // Respond with a 400 status code and an error message
    res
      .status(400)
      .json({ error: "Please authenticate through a valid token" });
  }
  try {
    // Verify the token using the secret key
    const data = jwt.verify(token, JWT_SECRET);

    // Attach the user information from the token to the request object
    req.user = data.user;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Log any errors during token verification
    console.error(error.message);

    // Respond with a 401 status code and an error message
    res.status(401).send("Internal Server Error");
  }
};

// Export the fetchuser middleware for use in other parts of the application
module.exports = fetchuser;