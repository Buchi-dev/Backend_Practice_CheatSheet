/**
 * APP.JS
 * ======
 * Main Express app configuration.
 * - Sets up middleware (JSON parsing, CORS, etc.)
 * - Mounts all routes
 * - Handles 404 and error responses
 */

const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/user.route');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Mount routes
app.use('/api/users', userRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('API is running!');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

module.exports = app;