/**
 * SERVER.JS
 * =========
 * Entry point of the backend application.
 * - Connects to MongoDB
 * - Starts the Express server
 */

// Load environment variables
require('dotenv').config();

const app = require("./app");
const connectDB = require("./configs/mongo.config");

// Connect to MongoDB
connectDB();

// Set port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
