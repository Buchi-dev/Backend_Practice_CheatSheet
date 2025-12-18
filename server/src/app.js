/**
 * APP.JS
 * ======
 * Main Express app configuration.
 * - Sets up middleware (JSON parsing, CORS, etc.)
 * - Mounts all routes
 * - Handles 404 and error responses
 */

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.route");

const { logger, limiter, errorHandler } = require("./middlewares");

const app = express();

// 1. Global Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(logger); // Log every request

// 2. Mount Routes
app.use("/api/", limiter);
app.use("/api/users", userRoutes);

// 3. Root route (optional)
app.get("/", (req, res) => {
  res.send("API is running!");
});

// 4. 404 Handler (for unmatched routes)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// 5. Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
