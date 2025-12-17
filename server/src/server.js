/**
 * SERVER.JS
 * =========
 * Entry point of the backend application.
 * - Connects to MongoDB
 * - Starts the Express server
 */

const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./configs/mongo.config');

// Connect to MongoDB
connectDB();

// Set port from environment or default to 5000
const PORT = 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});