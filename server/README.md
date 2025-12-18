# Backend Practice - Comprehensive Cheat Sheet & Documentation

This comprehensive guide covers both the actual backend architecture of this project and general Mongoose/Express patterns. Use this as both project documentation and a reference guide for CRUD operations and backend development.

---

## Table of Contents

### 📁 Project Architecture
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Middleware Stack](#middleware-stack)
- [Security Features](#security-features)

### 🗄️ Mongoose Operations Reference
- [Create Operations](#create-operations)
- [Read Operations](#read-operations)
- [Update Operations](#update-operations)
- [Delete Operations](#delete-operations)
- [Query Operations](#query-operations)
- [Advanced Operations](#advanced-operations)
- [Operations Summary Table](#summary-table)
- [Query Operators Reference](#query-operators-reference)

### 🛣️ Express Routes Guide
- [Express Routes Cheat Sheet](#express-routes-cheat-sheet)
  - [URL Parameters (req.params)](#url-parameters-reqparams)
  - [Query Strings (req.query)](#query-strings-reqquery)
  - [Request Body (req.body)](#request-body-reqbody)
  - [Request Headers (req.headers)](#request-headers-reqheaders)
  - [Complete Route Examples](#complete-route-examples)
  - [Route Parameters Summary](#route-parameters-summary)

### 📋 Mongoose Schema Guide
- [Mongoose Model Schema Cheat Sheet](#mongoose-model-schema-cheat-sheet)
  - [Basic Schema Structure](#basic-schema-structure)
  - [Data Types](#data-types)
  - [Validation Options](#validation-options)
  - [Schema Options](#schema-options)
  - [Indexes](#indexes)
  - [Virtual Properties](#virtual-properties)
  - [Instance Methods](#instance-methods)
  - [Static Methods](#static-methods)
  - [Middleware (Hooks)](#middleware-hooks)
  - [Complete Schema Example](#complete-schema-example)
  - [Schema Data Types Summary](#schema-data-types-summary)

### 🔧 Best Practices & Patterns
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Error Handling](#error-handling-patterns)
- [Authentication & Authorization](#authentication--authorization)

---

## Project Overview

A production-ready Express.js REST API with MongoDB backend featuring comprehensive security, authentication, role-based access control, and advanced middleware implementation.

**Key Features:**
- ✅ JWT Authentication & Authorization
- ✅ Role-Based Access Control (RBAC)
- ✅ Request Validation (express-validator)
- ✅ Rate Limiting & Speed Control
- ✅ MongoDB Injection Protection
- ✅ Security Headers (Helmet)
- ✅ HTTP Parameter Pollution Prevention
- ✅ Request Logging
- ✅ Centralized Error Handling
- ✅ CORS Configuration

---

## Project Structure

```
server/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server entry point
│   │
│   ├── configs/
│   │   └── mongo.config.js         # MongoDB connection
│   │
│   ├── controllers/
│   │   └── user.controller.js      # User business logic
│   │
│   ├── middlewares/
│   │   ├── index.js                # Middleware exports
│   │   ├── auth.middleware.js      # JWT authentication
│   │   ├── role.middleware.js      # Role-based authorization
│   │   ├── validation.middleware.js # Input validation
│   │   ├── errorHandler.middleware.js # Error handling
│   │   ├── loggers.middleware.js   # Request logging
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   └── mongoSanitize.middleware.js # NoSQL injection protection
│   │
│   ├── models/
│   │   └── user.model.js           # User schema & model
│   │
│   └── routes/
│       └── user.route.js           # User API routes
│
├── .env                            # Environment variables
├── package.json                    # Dependencies & scripts
└── README.md                       # This file
```

---

## Technology Stack

### Core Dependencies
- **express** (v5.2.1) - Web framework
- **mongoose** (v9.0.1) - MongoDB ODM
- **dotenv** (v17.2.3) - Environment variables
- **nodemon** (v3.1.11) - Development auto-restart

### Authentication & Security
- **jsonwebtoken** (v9.0.3) - JWT authentication
- **bcryptjs** (v3.0.3) - Password hashing
- **helmet** (v8.1.0) - Security headers
- **cors** (v2.8.5) - Cross-Origin Resource Sharing
- **hpp** (v0.2.3) - HTTP Parameter Pollution protection

### Validation & Rate Limiting
- **express-validator** (v7.3.1) - Request validation
- **express-rate-limit** (v8.2.1) - Rate limiting
- **express-slow-down** (v3.0.1) - Speed limiting

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Steps

1. **Clone and Navigate**
```bash
cd server
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas cloud connection
```

5. **Run Server**
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

---

## Environment Variables

| Variable      | Description                          | Example                                    |
|---------------|--------------------------------------|--------------------------------------------|
| `PORT`        | Server port number                   | `5000`                                     |
| `MONGO_URI`   | MongoDB connection string            | `mongodb://localhost:27017/mydatabase`     |
| `JWT_SECRET`  | Secret key for JWT signing           | `your_super_secret_key_here`               |
| `NODE_ENV`    | Environment mode                     | `development` or `production`              |

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Public Routes (No Authentication)

| Method | Endpoint           | Description            | Body Required                                                      |
|--------|--------------------|------------------------|---------------------------------------------------------------------|
| POST   | `/users/register`  | Register new user      | `firstName, lastName, email, password, age, gender, role?`          |
| POST   | `/users/login`     | Login user             | `email, password`                                                   |

### Protected Routes (Authentication Required)

| Method | Endpoint           | Description            | Auth | Role  | Body Required                                    |
|--------|--------------------|------------------------|------|-------|--------------------------------------------------|
| GET    | `/users/profile`   | Get current user       | ✅   | Any   | -                                                |
| GET    | `/users`           | Get all users          | ✅   | Admin | -                                                |
| GET    | `/users/:id`       | Get user by ID         | ✅   | Admin | -                                                |
| POST   | `/users`           | Create user            | ✅   | Admin | `firstName, lastName, email, password, age, gender, role?` |
| PUT    | `/users/:id`       | Update user            | ✅   | Admin | `firstName?, lastName?, email?, password?, age?, gender?, role?` |
| DELETE | `/users/:id`       | Delete user by ID      | ✅   | Admin | -                                                |
| DELETE | `/users/deleteAllUsers` | Delete all users  | ✅   | Admin | -                                                |

### Authentication Header Format
```
Authorization: Bearer <your_jwt_token>
```

### Example Requests

**Register:**
```bash
POST /api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@smu.edu.ph",
  "password": "securePass123",
  "age": 25,
  "gender": "male",
  "role": "staff"
}
```

**Login:**
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john.doe@smu.edu.ph",
  "password": "securePass123"
}
```

**Get Profile:**
```bash
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Middleware Stack

### Order of Execution (in app.js)

1. **Security Middleware**
   - `helmet()` - Secure HTTP headers
   - `mongoSanitize` - Prevent MongoDB injection
   - `hpp()` - Prevent HTTP Parameter Pollution

2. **Global Middleware**
   - `cors()` - Enable CORS
   - `express.json()` - Parse JSON bodies
   - `express.urlencoded()` - Parse URL-encoded bodies
   - `logger` - Log requests

3. **Rate Limiting**
   - `limiter` - Request rate limiting
   - `speedLimiter` - Speed control

4. **Route Handlers**
   - User routes with authentication & validation

5. **Error Handling**
   - 404 handler
   - `errorHandler` - Centralized error handling

### Middleware Details

**auth.middleware.js**
- Verifies JWT tokens
- Attaches decoded user to `req.user`
- Returns 401 for invalid/missing tokens

**role.middleware.js**
- Checks user role against required role
- Returns 403 if unauthorized
- Usage: `checkRole('admin')`

**validation.middleware.js**
- Validates request data using express-validator
- Two validators: `validateUser`, `validateRegistration`
- Returns 400 with validation errors

**rateLimit.middleware.js**
- `limiter`: 100 requests per 15 minutes
- `speedLimiter`: Slows down after 50 requests

**mongoSanitize.middleware.js**
- Sanitizes request data to prevent NoSQL injection
- Express 5.x compatible implementation

---

## Security Features

### Implemented Security Measures

1. **Authentication**
   - JWT-based authentication
   - 7-day token expiration
   - Password hashing with bcrypt (10 rounds)

2. **Authorization**
   - Role-based access control (staff/admin)
   - Protected routes for admin operations
   - Self-modification protection (can't delete own account)

3. **Input Validation**
   - Email domain validation (`@smu.edu.ph`)
   - Name format validation (letters only)
   - Age range validation (1-500)
   - Password minimum length (6 characters)

4. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Speed limiting after 50 requests
   - Applies to all `/api/*` routes

5. **Injection Protection**
   - MongoDB injection prevention
   - Data sanitization middleware
   - Parameter pollution prevention

6. **HTTP Security**
   - Helmet.js security headers
   - CORS configuration
   - JSON body size limit (10MB)

7. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Passwords excluded from query results by default
   - Password comparison method in model

---

---

## 🏗️ How to Build Backend Components

This section provides step-by-step guides for building each component of your backend, organized by folder structure. Each guide includes patterns from this project and general best practices.

---

## 📂 Folder 1: Models (Database Schemas)

Models define the structure of your data and handle database interactions.

### 📋 Purpose
- Define data structure and validation rules
- Handle data transformation (hashing, formatting)
- Provide reusable methods for data operations
- Enforce business logic at the database level

### 🔨 How to Build a Model

**Step 1: Create the Schema**

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Define fields here
}, {
  timestamps: true  // Adds createdAt and updatedAt
});
```

**Step 2: Add Field Definitions with Validations**

```javascript
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,        // Field is mandatory
    trim: true,            // Remove whitespace
    minlength: 2,         // Minimum length
    maxlength: 30,        // Maximum length
    match: /^[A-Za-z ]+$/ // Regex validation
  },
  email: {
    type: String,
    required: true,
    unique: true,          // No duplicates
    lowercase: true,       // Convert to lowercase
    match: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'staff'], // Only these values
    default: 'user'
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false         // Don't include in queries by default
  }
}, {
  timestamps: true
});
```

**Step 3: Add Pre-Save Middleware (Hooks)**

```javascript
// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();
  
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**Step 4: Add Instance Methods**

```javascript
// Methods available on individual documents
UserSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role
  };
};
```

**Step 5: Add Static Methods**

```javascript
// Methods available on the Model
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

UserSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};
```

**Step 6: Transform JSON Output**

```javascript
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;  // Remove sensitive data
  delete obj.__v;       // Remove version key
  return obj;
};
```

**Step 7: Export Model**

```javascript
module.exports = mongoose.model('User', UserSchema);
```

### 📝 Complete Model Example (From This Project)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z ]+$/,
    minlength: 2,
    maxlength: 30
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z]+$/,
    minlength: 2,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: /^[\w.-]+@smu\.edu\.ph$/,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 500
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'rather not say'],
    required: true
  },
  role: {
    type: String,
    enum: ['staff', 'admin'],
    default: 'staff'
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
```

### 🎯 Model Best Practices
✅ Always use `required: true` for mandatory fields
✅ Use `trim: true` to remove whitespace
✅ Add validation rules at schema level
✅ Use `select: false` for sensitive fields
✅ Hash passwords in pre-save middleware
✅ Create reusable methods for common operations
✅ Use `timestamps: true` for automatic dates
✅ Remove sensitive data from JSON responses

---

## 📂 Folder 2: Controllers (Business Logic)

Controllers handle the business logic and data processing for your routes.

### 📋 Purpose
- Process incoming requests
- Interact with models (database)
- Handle errors and validation
- Send responses back to client

### 🔨 How to Build a Controller

**Basic Controller Structure:**

```javascript
const Model = require('../models/model.name');

const controllerName = async (req, res, next) => {
  try {
    // 1. Extract data from request
    const data = req.body;
    const id = req.params.id;
    const query = req.query;
    
    // 2. Validate data (optional, if not using middleware)
    if (!data.field) {
      return res.status(400).json({
        success: false,
        message: 'Field is required'
      });
    }
    
    // 3. Perform database operation
    const result = await Model.create(data);
    
    // 4. Send response
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    // 5. Handle errors
    next(error);  // Pass to error handler
  }
};

module.exports = controllerName;
```

### 🔐 Authentication Controllers

**Register Controller:**
```javascript
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, age, gender, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user (password hashed automatically by model)
    const user = await User.create({
      firstName, lastName, email, password, age, gender,
      role: role || 'staff'
    });
    
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};
```

**Login Controller:**
```javascript
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }
    
    // Find user (include password field)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};
```

**Get Profile Controller:**
```javascript
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
```

### 📊 CRUD Controllers

**Create (POST):**
```javascript
const createItem = async (req, res, next) => {
  try {
    const item = await Model.create(req.body);
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};
```

**Read All (GET):**
```javascript
const getAllItems = async (req, res, next) => {
  try {
    const items = await Model.find();
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};
```

**Read One (GET):**
```javascript
const getItemById = async (req, res, next) => {
  try {
    const item = await Model.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};
```

**Update (PUT/PATCH):**
```javascript
const updateItem = async (req, res, next) => {
  try {
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Return updated document
        runValidators: true  // Run schema validators
      }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};
```

**Delete (DELETE):**
```javascript
const deleteItem = async (req, res, next) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Item deleted',
      data: item
    });
  } catch (error) {
    next(error);
  }
};
```

### 🎯 Controller Best Practices
✅ Always use try-catch blocks
✅ Use next(error) to pass errors to error handler
✅ Return early for validation errors
✅ Use descriptive variable names
✅ Check if resource exists before operations
✅ Use appropriate HTTP status codes
✅ Always return consistent JSON structure
✅ Pass errors to centralized error handler

### 📤 Exporting Controllers

```javascript
module.exports = {
  // Auth controllers
  register,
  login,
  getProfile,
  // CRUD controllers
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
```

---

## 📂 Folder 3: Routes (API Endpoints)

Routes connect HTTP endpoints to controller functions and apply middleware.

### 📋 Purpose
- Define API endpoints (URLs)
- Connect routes to controllers
- Apply middleware (auth, validation, etc.)
- Organize routes by resource

### 🔨 How to Build Routes

**Step 1: Create Router**

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.name');
const { auth, checkRole, validate } = require('../middlewares');
```

**Step 2: Define Public Routes**

```javascript
// Public routes (no authentication)
router.post('/register', controller.register);
router.post('/login', controller.login);
```

**Step 3: Define Protected Routes**

```javascript
// Protected routes (authentication required)
router.get('/profile', auth, controller.getProfile);
```

**Step 4: Define Role-Based Routes**

```javascript
// Admin only routes
router.get('/', auth, checkRole('admin'), controller.getAll);
router.post('/', auth, checkRole('admin'), validate, controller.create);
router.put('/:id', auth, checkRole('admin'), validate, controller.update);
router.delete('/:id', auth, checkRole('admin'), controller.delete);
```

**Step 5: Export Router**

```javascript
module.exports = router;
```

### 📝 Complete Routes Example (From This Project)

```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, checkRole, validateUser, validateRegistration } = require('../middlewares');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Register new user
router.post('/register', validateRegistration, userController.register);

// Login user
router.post('/login', userController.login);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// Get current user profile (any authenticated user)
router.get('/profile', auth, userController.getProfile);

// Get all users (admin only)
router.get('/', auth, checkRole('admin'), userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:id', auth, checkRole('admin'), userController.getUserById);

// Create user (admin only) - with validation
router.post('/', auth, checkRole('admin'), validateUser, userController.createUser);

// Update user (admin only) - with validation
router.put('/:id', auth, checkRole('admin'), validateUser, userController.updateUser);

// Delete user by ID (admin only)
router.delete('/:id', auth, checkRole('admin'), userController.deleteUser);

module.exports = router;
```

### 🛣️ Route Patterns

**REST API Standard:**
```javascript
// GET    /api/users       - Get all users
// GET    /api/users/:id   - Get user by ID
// POST   /api/users       - Create new user
// PUT    /api/users/:id   - Update user (full)
// PATCH  /api/users/:id   - Update user (partial)
// DELETE /api/users/:id   - Delete user
```

**Authentication Routes:**
```javascript
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', auth, controller.logout);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password/:token', controller.resetPassword);
router.get('/verify-email/:token', controller.verifyEmail);
```

**Nested Routes:**
```javascript
// Get user's posts: GET /api/users/:userId/posts
router.get('/:userId/posts', auth, postsController.getUserPosts);

// Create post for user: POST /api/users/:userId/posts
router.post('/:userId/posts', auth, postsController.createPost);
```

**Query Parameters:**
```javascript
// GET /api/users?page=1&limit=10&sort=name&order=asc
router.get('/', controller.getAll);

// Controller handles req.query
const { page, limit, sort, order } = req.query;
```

### 🔗 Middleware Chain Order

```javascript
// Correct order: validation → auth → role check → controller
router.post('/',
  validateData,      // 1. Validate input
  auth,              // 2. Authenticate
  checkRole('admin'), // 3. Check permissions
  controller.create   // 4. Execute logic
);
```

### 🎯 Routes Best Practices
✅ Group related routes together
✅ Use descriptive route names
✅ Apply middleware in correct order
✅ Use URL parameters for IDs (`:id`)
✅ Use query strings for filters/pagination
✅ Follow REST conventions
✅ Version your API (`/api/v1/users`)
✅ Comment route sections clearly

---

## 📂 Folder 4: Middlewares (Request Processors)

Middlewares intercept requests before they reach controllers.

### 📋 Purpose
- Authenticate users
- Validate input data
- Log requests
- Rate limiting
- Error handling
- Transform request/response

### 🔨 How to Build Middleware

**Basic Middleware Structure:**

```javascript
const middlewareName = (req, res, next) => {
  // 1. Process request
  // 2. Validate or modify req/res
  // 3. Call next() to continue, or send response to stop
  
  if (condition) {
    return res.status(400).json({ error: 'Something wrong' });
  }
  
  next(); // Continue to next middleware/controller
};

module.exports = middlewareName;
```

### 🔐 Authentication Middleware

```javascript
// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request
    req.user = decoded;
    
    next(); // Continue to next middleware
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;
```

### 🔒 Role-Based Authorization Middleware

```javascript
// middlewares/role.middleware.js
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission'
      });
    }
    
    next();
  };
};

module.exports = checkRole;

// Usage: checkRole('admin'), checkRole('admin', 'moderator')
```

### ✅ Validation Middleware

```javascript
// middlewares/validation.middleware.js
const validateUser = (req, res, next) => {
  const { firstName, lastName, email, age, gender } = req.body;
  
  // Check required fields
  if (!firstName || !lastName || !email || !age || !gender) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  // Validate name format
  const nameRegex = /^[A-Za-z ]+$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return res.status(400).json({
      success: false,
      message: 'Names must contain only letters'
    });
  }
  
  // Validate email
  const emailRegex = /^[\w.-]+@smu\.edu\.ph$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email domain'
    });
  }
  
  // Validate age range
  if (age < 1 || age > 500) {
    return res.status(400).json({
      success: false,
      message: 'Age must be between 1 and 500'
    });
  }
  
  // Validate gender
  const allowedGenders = ['male', 'female', 'rather not say'];
  if (!allowedGenders.includes(gender)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid gender'
    });
  }
  
  next();
};

module.exports = { validateUser };
```

### 📝 Logger Middleware

```javascript
// middlewares/loggers.middleware.js
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  next();
};

module.exports = logger;
```

### ⚠️ Error Handler Middleware

```javascript
// middlewares/errorHandler.middleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
```

### 🚦 Rate Limiting Middleware

```javascript
// middlewares/rateLimit.middleware.js
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Limit requests per time window
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // Max 100 requests per window
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, try again later'
    });
  }
});

// Slow down after threshold
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50,            // Allow 50 requests
  delayMs: () => 500         // Add 500ms delay after
});

module.exports = { limiter, speedLimiter };
```

### 🛡️ MongoDB Sanitization Middleware

```javascript
// middlewares/mongoSanitize.middleware.js
const sanitizeData = (data) => {
  if (typeof data !== 'object' || data === null) return data;
  
  const sanitized = Array.isArray(data) ? [] : {};
  
  for (const key in data) {
    // Remove dangerous characters
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    
    const value = data[key];
    
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

const mongoSanitize = (req, res, next) => {
  if (req.body) req.body = sanitizeData(req.body);
  if (req.params) req.params = sanitizeData(req.params);
  next();
};

module.exports = mongoSanitize;
```

### 📦 Middleware Index (Export All)

```javascript
// middlewares/index.js
const auth = require('./auth.middleware');
const errorHandler = require('./errorHandler.middleware');
const logger = require('./loggers.middleware');
const { limiter, speedLimiter } = require('./rateLimit.middleware');
const checkRole = require('./role.middleware');
const { validateUser, validateRegistration } = require('./validation.middleware');
const mongoSanitize = require('./mongoSanitize.middleware');

module.exports = {
  auth,
  errorHandler,
  logger,
  limiter,
  speedLimiter,
  checkRole,
  validateUser,
  validateRegistration,
  mongoSanitize
};
```

### 🎯 Middleware Best Practices
✅ Always call `next()` or send a response
✅ Use descriptive error messages
✅ Handle errors properly
✅ Keep middleware focused (single responsibility)
✅ Order matters - auth before role check
✅ Use middleware factories for configurability
✅ Log important events
✅ Export through index.js for clean imports

---

## 📂 Folder 5: Configs (Configuration Files)

Configs centralize environment and external service configurations.

### 📋 Purpose
- Database connections
- External service setup
- Environment-specific settings
- Reusable configuration logic

### 🔨 How to Build Config Files

### 💾 Database Configuration

```javascript
// configs/mongo.config.js
const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * Handles connection and error logging
 */
const connectDB = async () => {
  try {
    // Connect using connection string from environment
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase',
      {
        // Mongoose 6+ doesn't need these options anymore
        // useNewUrlParser: true,
        // useUnifiedTopology: true
      }
    );
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Optional: Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB error: ${err}`);
    });
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
```

### 🔧 JWT Configuration

```javascript
// configs/jwt.config.js
module.exports = {
  secret: process.env.JWT_SECRET || 'default_secret_key',
  expiresIn: '7d',
  algorithm: 'HS256',
  
  // Generate token
  generateToken: (payload) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, module.exports.secret, {
      expiresIn: module.exports.expiresIn
    });
  },
  
  // Verify token
  verifyToken: (token) => {
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, module.exports.secret);
  }
};
```

### ⚙️ Server Configuration

```javascript
// configs/server.config.js
module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 100 : 1000
  },
  
  // Body parser limits
  bodyLimit: '10mb',
  
  // Logging
  enableLogging: process.env.NODE_ENV !== 'test'
};
```

### 📧 Email Configuration (Example)

```javascript
// configs/email.config.js
const nodemailer = require('nodemailer');

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Send email function
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  };
  
  return await transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendEmail };
```

### 🌐 Environment Variables

```javascript
// configs/env.config.js
require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGO_URI: process.env.MONGO_URI,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Email
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  
  // AWS (if using)
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_BUCKET: process.env.AWS_BUCKET,
  
  // Validation
  validate() {
    const required = ['MONGO_URI', 'JWT_SECRET'];
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required env variables: ${missing.join(', ')}`);
    }
  }
};
```

### 🎯 Config Best Practices
✅ Use environment variables for sensitive data
✅ Provide default values for development
✅ Validate required environment variables
✅ Keep configs separate from business logic
✅ Export reusable functions
✅ Handle connection errors gracefully
✅ Log connection success/failure
✅ Use `.env` file for local development

### 📄 .env File Example

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/mydatabase
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d

# Email (if using)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com

# AWS (if using)
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_BUCKET=your_bucket_name
```

---

## 🏗️ Complete Project Setup Flow

### Step-by-Step Build Order

**1. Initialize Project**
```bash
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken
npm install nodemon --save-dev
```

**2. Create Folder Structure**
```
src/
├── configs/
├── models/
├── controllers/
├── middlewares/
├── routes/
├── app.js
└── server.js
```

**3. Build in This Order:**

1. **Configs** (Foundation)
   - `mongo.config.js` - Database connection
   - Create `.env` file

2. **Models** (Data Layer)
   - Define schemas with validation
   - Add methods and hooks

3. **Middlewares** (Processing Layer)
   - `auth.middleware.js` - Authentication
   - `role.middleware.js` - Authorization
   - `validation.middleware.js` - Input validation
   - `errorHandler.middleware.js` - Error handling
   - `logger.middleware.js` - Request logging
   - `index.js` - Export all middleware

4. **Controllers** (Business Logic)
   - Implement CRUD operations
   - Handle authentication
   - Process data

5. **Routes** (API Layer)
   - Define endpoints
   - Connect to controllers
   - Apply middleware

6. **App Setup** (Application)
   - `app.js` - Configure Express
   - `server.js` - Start server

### 🎯 Testing Your Backend

**Test with cURL:**
```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@smu.edu.ph","password":"123456","age":25,"gender":"male"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@smu.edu.ph","password":"123456"}'

# Get Profile (with token)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Create Operations

### Create (Insert One)
Adds a new document to the collection using data from the request body.

**Usage:**
```javascript
const user = await User.create(req.body);
```

**What it does:**
- Validates data against the schema
- Inserts a new document into the database
- Returns the created document with its `_id`

**Example in Controller:**
```javascript
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

### Insert Many
Inserts multiple documents at once.

**Usage:**
```javascript
const users = await User.insertMany([
  { name: "John", email: "john@example.com" },
  { name: "Jane", email: "jane@example.com" }
]);
```

**What it does:**
- Bulk insert operation (faster than multiple `create` calls)
- Returns an array of created documents
- Stops on first error by default (can be configured)

---

## Read Operations

### Find All (Get All)
Retrieves all documents from the collection.

**Usage:**
```javascript
const users = await User.find();
```

**What it does:**
- Returns an array of all documents
- Returns empty array `[]` if no documents exist
- Can be chained with sort, limit, skip, etc.

**Example in Controller:**
```javascript
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Find One by ID
Finds a single document by its unique MongoDB `_id`.

**Usage:**
```javascript
const user = await User.findById(req.params.id);
```

**What it does:**
- Searches by `_id` field
- Returns the document or `null` if not found
- Automatically converts string ID to ObjectId

**Example in Controller:**
```javascript
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Find One by Field
Finds a single document matching a specific field (e.g., email).

**Usage:**
```javascript
const user = await User.findOne({ email: req.body.email });
```

**What it does:**
- Returns the first matching document
- Returns `null` if no match found
- Can match multiple fields: `{ firstName: "John", lastName: "Doe" }`

**Example:**
```javascript
// Find by email
const user = await User.findOne({ email: "john@example.com" });

// Find by multiple fields
const user = await User.findOne({ firstName: "John", age: 25 });
```

### Find with Multiple Conditions
Finds documents matching multiple criteria.

**Usage:**
```javascript
const users = await User.find({ 
  age: { $gte: 18 }, 
  gender: "male" 
});
```

**Common Query Operators:**
- `$eq` - Equal to
- `$ne` - Not equal to
- `$gt` - Greater than
- `$gte` - Greater than or equal to
- `$lt` - Less than
- `$lte` - Less than or equal to
- `$in` - Matches any value in array
- `$nin` - Matches none of the values in array

**Examples:**
```javascript
// Age between 18 and 30
const users = await User.find({ age: { $gte: 18, $lte: 30 } });

// Gender is male OR female
const users = await User.find({ gender: { $in: ['male', 'female'] } });

// Not equal to
const users = await User.find({ status: { $ne: 'inactive' } });
```

### Exists Check
Checks if a document exists without retrieving it.

**Usage:**
```javascript
const exists = await User.exists({ email: req.body.email });
```

**What it does:**
- Returns `{ _id: ObjectId }` if document exists
- Returns `null` if document doesn't exist
- More efficient than `findOne` when you only need to check existence

---

## Update Operations

### Update by ID
Updates a document by its `_id` with new data from the request body.

**Usage:**
```javascript
const user = await User.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true, runValidators: true }
);
```

**Options:**
- `{ new: true }` - Returns the updated document (default: returns old document)
- `{ runValidators: true }` - Runs schema validation on update
- `{ upsert: true }` - Creates document if it doesn't exist

**Example in Controller:**
```javascript
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
```

### Update One by Field
Updates a single document matching specific criteria.

**Usage:**
```javascript
const user = await User.findOneAndUpdate(
  { email: req.body.email },
  { $set: { age: 30 } },
  { new: true, runValidators: true }
);
```

**Update Operators:**
- `$set` - Set field value
- `$unset` - Remove field
- `$inc` - Increment number
- `$push` - Add to array
- `$pull` - Remove from array

**Examples:**
```javascript
// Increment age by 1
await User.findByIdAndUpdate(id, { $inc: { age: 1 } });

// Add tag to array
await User.findByIdAndUpdate(id, { $push: { tags: "premium" } });

// Remove field
await User.findByIdAndUpdate(id, { $unset: { middleName: "" } });
```

### Update Many
Updates all documents matching the filter.

**Usage:**
```javascript
const result = await User.updateMany(
  { isActive: false },
  { $set: { isActive: true } }
);
```

**What it does:**
- Updates multiple documents at once
- Returns an object with `modifiedCount`, `matchedCount`, etc.
- Does not return the updated documents

**Example:**
```javascript
// Activate all inactive users
const result = await User.updateMany(
  { isActive: false },
  { $set: { isActive: true } }
);
console.log(`Updated ${result.modifiedCount} users`);
```

---

## Delete Operations

### Delete by ID
Deletes a single document by its `_id`.

**Usage:**
```javascript
const user = await User.findByIdAndDelete(req.params.id);
```

**What it does:**
- Deletes document and returns it
- Returns `null` if document not found
- Useful when you need the deleted document data

**Example in Controller:**
```javascript
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Delete One by Field
Deletes a single document matching specific criteria.

**Usage:**
```javascript
const user = await User.findOneAndDelete({ email: req.body.email });
```

**What it does:**
- Deletes first matching document
- Returns the deleted document
- Returns `null` if no match found

### Delete Many
Deletes all documents matching the filter.

**Usage:**
```javascript
const result = await User.deleteMany({ isActive: false });
```

**What it does:**
- Deletes multiple documents at once
- Returns an object with `deletedCount`
- Does not return the deleted documents

**Example:**
```javascript
// Delete all inactive users
const result = await User.deleteMany({ isActive: false });
console.log(`Deleted ${result.deletedCount} users`);

// Delete ALL documents (dangerous!)
const result = await User.deleteMany({});
```

---

## Query Operations

### Count Documents
Counts the number of documents matching a filter.

**Usage:**
```javascript
const count = await User.countDocuments({ gender: 'male' });
```

**What it does:**
- Counts documents matching the filter
- Returns a number
- Accurate count (can be slow for large collections)

**Examples:**
```javascript
// Count all users
const totalUsers = await User.countDocuments();

// Count male users
const maleCount = await User.countDocuments({ gender: 'male' });

// Count users over 18
const adultCount = await User.countDocuments({ age: { $gte: 18 } });
```

### Estimated Document Count
Gets an estimated count of all documents (fast, no filter).

**Usage:**
```javascript
const total = await User.estimatedDocumentCount();
```

**What it does:**
- Fast estimate based on collection metadata
- Does NOT accept a filter
- Good for displaying total counts on dashboards

### Sort, Limit, Skip (Pagination)
Retrieves documents with sorting, limiting, and pagination.

**Usage:**
```javascript
const users = await User.find()
  .sort({ age: -1 })
  .limit(10)
  .skip(20);
```

**Sorting:**
- `1` or `'asc'` - Ascending order
- `-1` or `'desc'` - Descending order

**What it does:**
- `sort()` - Orders results by field(s)
- `limit()` - Limits number of results
- `skip()` - Skips first N results (for pagination)

**Pagination Example:**
```javascript
const page = 2; // Current page
const pageSize = 10; // Items per page

const users = await User.find()
  .sort({ createdAt: -1 })
  .limit(pageSize)
  .skip((page - 1) * pageSize);

// Get total count for pagination info
const totalUsers = await User.countDocuments();
const totalPages = Math.ceil(totalUsers / pageSize);
```

### Select Specific Fields
Returns only specific fields from documents.

**Usage:**
```javascript
const users = await User.find().select('firstName lastName email');
```

**What it does:**
- Includes only specified fields
- Use `-fieldName` to exclude fields
- Reduces data transfer and improves performance

**Examples:**
```javascript
// Include only firstName and email
const users = await User.find().select('firstName email');

// Exclude password field
const users = await User.find().select('-password');

// Multiple exclusions
const users = await User.find().select('-password -__v');
```

### Distinct Values
Gets unique values for a specific field.

**Usage:**
```javascript
const uniqueGenders = await User.distinct('gender');
```

**What it does:**
- Returns array of unique values
- Useful for filters, dropdowns, analytics
- Can be combined with a query filter

**Example:**
```javascript
// Get all unique genders
const genders = await User.distinct('gender');
// Returns: ['male', 'female', 'other']

// Get unique ages for male users
const maleAges = await User.distinct('age', { gender: 'male' });
```

### Lean Queries
Returns plain JavaScript objects instead of Mongoose documents.

**Usage:**
```javascript
const users = await User.find().lean();
```

**What it does:**
- Returns plain JS objects (no Mongoose methods)
- Faster and uses less memory
- Good for read-only operations

**When to use:**
- When you don't need to modify/save documents
- For API responses (already serializing to JSON)
- Performance-critical queries

---

## Advanced Operations

### Aggregation Pipeline
Performs complex data processing and analysis.

**Usage:**
```javascript
const stats = await User.aggregate([
  { $group: { _id: "$gender", total: { $sum: 1 } } }
]);
```

**Common Pipeline Stages:**
- `$match` - Filter documents (like `find`)
- `$group` - Group documents and calculate aggregates
- `$sort` - Sort results
- `$project` - Reshape documents
- `$limit` - Limit results
- `$skip` - Skip documents

**Examples:**

**Group by gender and count:**
```javascript
const genderStats = await User.aggregate([
  { $group: { 
      _id: "$gender", 
      count: { $sum: 1 },
      avgAge: { $avg: "$age" }
    } 
  }
]);
// Returns: [{ _id: 'male', count: 150, avgAge: 28.5 }, ...]
```

**Filter, group, and sort:**
```javascript
const ageGroups = await User.aggregate([
  { $match: { isActive: true } },
  { $group: { 
      _id: { $floor: { $divide: ["$age", 10] } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);
```

**Calculate statistics:**
```javascript
const stats = await User.aggregate([
  { $group: {
      _id: null,
      totalUsers: { $sum: 1 },
      avgAge: { $avg: "$age" },
      minAge: { $min: "$age" },
      maxAge: { $max: "$age" }
    }
  }
]);
```

### Population (References)
Automatically replace document references with actual documents.

**Usage:**
```javascript
const user = await User.findById(id).populate('posts');
```

**Schema Setup:**
```javascript
// User model with reference
const userSchema = new mongoose.Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});
```

**Examples:**
```javascript
// Populate single reference
const user = await User.findById(id).populate('posts');

// Populate multiple references
const user = await User.findById(id).populate('posts').populate('comments');

// Populate with field selection
const user = await User.findById(id).populate('posts', 'title content');

// Nested population
const user = await User.findById(id).populate({
  path: 'posts',
  populate: { path: 'author' }
});
```

### Transactions
Execute multiple operations atomically (all succeed or all fail).

**Usage:**
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await User.create([{ name: "John" }], { session });
  await Post.create([{ title: "Hello" }], { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

**When to use:**
- When multiple operations must succeed together
- Financial transactions
- Creating related documents

### Text Search
Perform text search on indexed fields.

**Schema Setup:**
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  bio: String
});
userSchema.index({ name: 'text', bio: 'text' });
```

**Usage:**
```javascript
const users = await User.find({ $text: { $search: "john developer" } });
```

---

## Summary Table

| Operation              | Method                      | Purpose                                         | Returns              |
|------------------------|-----------------------------|-------------------------------------------------|----------------------|
| **CREATE**             |                             |                                                 |                      |
| Create one             | `create()`                  | Add a new document                              | Document             |
| Insert many            | `insertMany()`              | Bulk insert multiple documents                  | Array of documents   |
| **READ**               |                             |                                                 |                      |
| Find all               | `find()`                    | Get all documents                               | Array                |
| Find by ID             | `findById()`                | Get one document by `_id`                       | Document or null     |
| Find one               | `findOne()`                 | Get one document by field(s)                    | Document or null     |
| Exists                 | `exists()`                  | Check if document exists                        | Object or null       |
| Count                  | `countDocuments()`          | Count documents matching filter                 | Number               |
| Estimated count        | `estimatedDocumentCount()`  | Fast estimate of total documents                | Number               |
| Distinct               | `distinct()`                | Get unique values for a field                   | Array                |
| **UPDATE**             |                             |                                                 |                      |
| Update by ID           | `findByIdAndUpdate()`       | Update document by `_id`                        | Document or null     |
| Update one             | `findOneAndUpdate()`        | Update first matching document                  | Document or null     |
| Update many            | `updateMany()`              | Update multiple documents                       | Result object        |
| **DELETE**             |                             |                                                 |                      |
| Delete by ID           | `findByIdAndDelete()`       | Delete document by `_id`                        | Document or null     |
| Delete one             | `findOneAndDelete()`        | Delete first matching document                  | Document or null     |
| Delete many            | `deleteMany()`              | Delete multiple documents                       | Result object        |
| **QUERY MODIFIERS**    |                             |                                                 |                      |
| Sort                   | `.sort()`                   | Order results                                   | Query                |
| Limit                  | `.limit()`                  | Limit number of results                         | Query                |
| Skip                   | `.skip()`                   | Skip first N results                            | Query                |
| Select                 | `.select()`                 | Choose which fields to return                   | Query                |
| Lean                   | `.lean()`                   | Return plain JS objects                         | Query                |
| Populate               | `.populate()`               | Replace references with documents               | Query                |
| **ADVANCED**           |                             |                                                 |                      |
| Aggregation            | `aggregate()`               | Complex data processing                         | Array                |
| Text search            | `find({ $text })`           | Full-text search                                | Array                |
| Transactions           | `startSession()`            | Atomic multi-document operations                | Session              |

---

## Query Operators Reference

### Comparison
- `$eq` - Equal to
- `$ne` - Not equal to
- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$lt` - Less than
- `$lte` - Less than or equal
- `$in` - Matches any value in array
- `$nin` - Matches none in array

### Logical
- `$and` - Join conditions with AND
- `$or` - Join conditions with OR
- `$not` - Inverts condition
- `$nor` - Joins conditions with NOR

### Element
- `$exists` - Field exists
- `$type` - Field is of type

### Array
- `$all` - Array contains all elements
- `$elemMatch` - Array element matches condition
- `$size` - Array has specific length

---

## Best Practices

1. **Always use try-catch blocks** in async controllers
2. **Validate input** before database operations
3. **Use indexes** for frequently queried fields
4. **Use `.lean()`** for read-only operations
5. **Use `.select()`** to limit returned fields
6. **Use pagination** for large result sets
7. **Use `{ new: true, runValidators: true }`** in updates
8. **Handle null returns** from find operations
9. **Use transactions** for related operations
10. **Index text fields** for text search

---

## Common Patterns

### Pagination with Total Count
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const [users, total] = await Promise.all([
  User.find().skip(skip).limit(limit),
  User.countDocuments()
]);

res.json({
  success: true,
  data: users,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  }
});
```

### Search with Filters
```javascript
const { search, gender, minAge, maxAge } = req.query;

const filter = {};
if (search) filter.$text = { $search: search };
if (gender) filter.gender = gender;
if (minAge || maxAge) {
  filter.age = {};
  if (minAge) filter.age.$gte = parseInt(minAge);
  if (maxAge) filter.age.$lte = parseInt(maxAge);
}

const users = await User.find(filter);
```

### Soft Delete Pattern
```javascript
// Schema
const userSchema = new mongoose.Schema({
  name: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
});

// Soft delete
const softDelete = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};

// Find only active users
const activeUsers = await User.find({ isDeleted: false });
```

---

**Tip:**  
Replace `User` with your model name as needed.  
Use `req.body`, `req.params`, or `req.query` for input from the client.

---

## Express Routes Cheat Sheet

This section covers how to handle different types of data in Express routes: URL parameters, query strings, and request bodies.

### URL Parameters (req.params)
Data embedded in the URL path.

**Route Definition:**
```javascript
router.get('/users/:id', getUserById);
router.get('/users/:userId/posts/:postId', getPostByUser);
```

**Accessing Parameters:**
```javascript
const getUserById = async (req, res) => {
  const userId = req.params.id;
  // URL: /users/123 → userId = "123"
  
  const user = await User.findById(userId);
  res.json({ success: true, data: user });
};

const getPostByUser = async (req, res) => {
  const { userId, postId } = req.params;
  // URL: /users/123/posts/456 → userId = "123", postId = "456"
  
  res.json({ userId, postId });
};
```

**When to use:**
- Required data that identifies a resource
- RESTful API design (e.g., `/users/:id`, `/posts/:postId`)

---

### Query Strings (req.query)
Data passed in the URL after `?` (optional parameters).

**URL Examples:**
```
/users?page=2&limit=10
/users?search=john&gender=male&minAge=18
/products?category=electronics&sort=price&order=asc
```

**Accessing Query Parameters:**
```javascript
const getAllUsers = async (req, res) => {
  // Extract query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search;
  const gender = req.query.gender;
  
  // Build filter object
  const filter = {};
  if (search) filter.name = new RegExp(search, 'i'); // Case-insensitive search
  if (gender) filter.gender = gender;
  
  // Execute query
  const users = await User.find(filter)
    .limit(limit)
    .skip((page - 1) * limit);
  
  res.json({ success: true, data: users });
};
```

**Common Patterns:**

**Pagination:**
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const users = await User.find().skip(skip).limit(limit);
```

**Sorting:**
```javascript
const sortBy = req.query.sortBy || 'createdAt';
const order = req.query.order === 'asc' ? 1 : -1;

const users = await User.find().sort({ [sortBy]: order });
```

**Filtering:**
```javascript
const { gender, minAge, maxAge, status } = req.query;

const filter = {};
if (gender) filter.gender = gender;
if (status) filter.status = status;
if (minAge || maxAge) {
  filter.age = {};
  if (minAge) filter.age.$gte = parseInt(minAge);
  if (maxAge) filter.age.$lte = parseInt(maxAge);
}

const users = await User.find(filter);
```

**Search:**
```javascript
const search = req.query.search;

const filter = search 
  ? { $or: [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ]}
  : {};

const users = await User.find(filter);
```

**When to use:**
- Optional parameters
- Filtering, sorting, pagination
- Search queries

---

### Request Body (req.body)
Data sent in the HTTP request body (POST, PUT, PATCH).

**Accessing Body Data:**
```javascript
const createUser = async (req, res) => {
  // Extract entire body
  const userData = req.body;
  
  // Or extract specific fields
  const { firstName, lastName, email, age } = req.body;
  
  const user = await User.create(userData);
  res.status(201).json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;
  
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });
  res.json({ success: true, data: user });
};
```

**Client sends (JSON):**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "age": 25
}
```

**When to use:**
- Creating resources (POST)
- Updating resources (PUT, PATCH)
- Complex data structures

---

### Request Headers (req.headers)
Metadata about the request.

**Accessing Headers:**
```javascript
const getProfile = async (req, res) => {
  // Get authorization token
  const token = req.headers.authorization?.split(' ')[1];
  
  // Get content type
  const contentType = req.headers['content-type'];
  
  // Custom headers
  const apiKey = req.headers['x-api-key'];
  
  res.json({ token, contentType, apiKey });
};
```

**Common Headers:**
- `authorization` - Authentication tokens
- `content-type` - Data format (application/json)
- `accept` - Expected response format
- `user-agent` - Client information

---

### Complete Route Examples

**GET with Query Parameters:**
```javascript
// Route: GET /api/users?page=1&limit=10&gender=male&search=john
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, gender, search } = req.query;
    
    const filter = {};
    if (gender) filter.gender = gender;
    if (search) filter.name = new RegExp(search, 'i');
    
    const users = await User.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**GET with URL Parameter:**
```javascript
// Route: GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

**POST with Request Body:**
```javascript
// Route: POST /api/users
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

**PUT with URL Parameter and Body:**
```javascript
// Route: PUT /api/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

**DELETE with URL Parameter:**
```javascript
// Route: DELETE /api/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

### Route Parameters Summary

| Type          | Location         | Access Method  | Use Case                           |
|---------------|------------------|----------------|------------------------------------|
| URL Params    | URL path         | `req.params`   | Resource identification            |
| Query String  | URL after `?`    | `req.query`    | Optional filters, pagination       |
| Request Body  | HTTP body        | `req.body`     | Creating/updating resources        |
| Headers       | HTTP headers     | `req.headers`  | Authentication, metadata           |

---

## Mongoose Model Schema Cheat Sheet

This section covers how to define Mongoose schemas with various data types, validations, and options.

### Basic Schema Structure

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Field definitions go here
  },
  {
    // Schema options go here
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
```

---

### Data Types

**String:**
```javascript
name: {
  type: String,
  required: true,
  trim: true,
  lowercase: true, // Convert to lowercase
  uppercase: true, // Convert to uppercase
  minlength: 2,
  maxlength: 50,
  match: /^[A-Za-z]+$/, // Regex validation
  enum: ['active', 'inactive'], // Only allow these values
  default: 'active'
}
```

**Number:**
```javascript
age: {
  type: Number,
  required: true,
  min: 0,
  max: 120,
  default: 18
}
```

**Boolean:**
```javascript
isActive: {
  type: Boolean,
  default: true
}
```

**Date:**
```javascript
birthDate: {
  type: Date,
  required: true,
  default: Date.now
}
```

**Array of Strings:**
```javascript
tags: {
  type: [String],
  default: []
}
```

**Array of Numbers:**
```javascript
scores: {
  type: [Number],
  validate: {
    validator: function(arr) {
      return arr.length <= 10;
    },
    message: 'Cannot have more than 10 scores'
  }
}
```

**Array of Objects:**
```javascript
addresses: [{
  street: String,
  city: String,
  zipCode: String,
  isDefault: { type: Boolean, default: false }
}]
```

**Nested Object:**
```javascript
profile: {
  bio: String,
  avatar: String,
  social: {
    twitter: String,
    linkedin: String
  }
}
```

**ObjectId (Reference):**
```javascript
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
```

**Mixed (Any Type):**
```javascript
metadata: {
  type: mongoose.Schema.Types.Mixed
}
```

**Buffer (Binary Data):**
```javascript
image: {
  type: Buffer
}
```

---

### Validation Options

**Required:**
```javascript
email: {
  type: String,
  required: true,
  required: [true, 'Email is required'] // Custom error message
}
```

**Unique:**
```javascript
email: {
  type: String,
  unique: true
}
```

**Enum (Specific Values Only):**
```javascript
role: {
  type: String,
  enum: ['user', 'admin', 'moderator'],
  enum: {
    values: ['user', 'admin', 'moderator'],
    message: '{VALUE} is not a valid role'
  }
}
```

**Min/Max Length:**
```javascript
username: {
  type: String,
  minlength: [3, 'Username must be at least 3 characters'],
  maxlength: [20, 'Username cannot exceed 20 characters']
}
```

**Min/Max (Numbers):**
```javascript
age: {
  type: Number,
  min: [0, 'Age cannot be negative'],
  max: [120, 'Age cannot exceed 120']
}
```

**Match (Regex):**
```javascript
email: {
  type: String,
  match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please enter a valid email']
}
```

**Custom Validation:**
```javascript
age: {
  type: Number,
  validate: {
    validator: function(value) {
      return value >= 18;
    },
    message: 'Must be 18 or older'
  }
}
```

**Async Validation:**
```javascript
email: {
  type: String,
  validate: {
    validator: async function(value) {
      const user = await mongoose.models.User.findOne({ email: value });
      return !user;
    },
    message: 'Email already exists'
  }
}
```

---

### Schema Options

**Timestamps:**
```javascript
const userSchema = new mongoose.Schema({
  name: String
}, {
  timestamps: true // Adds createdAt and updatedAt
});
```

**Custom Timestamp Field Names:**
```javascript
const userSchema = new mongoose.Schema({
  name: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
```

**Disable _id:**
```javascript
const subSchema = new mongoose.Schema({
  field: String
}, {
  _id: false
});
```

**toJSON Options:**
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  password: String
}, {
  toJSON: {
    virtuals: true, // Include virtual properties
    transform: function(doc, ret) {
      delete ret.password; // Remove password from JSON
      return ret;
    }
  }
});
```

---

### Indexes

**Single Field Index:**
```javascript
userSchema.index({ email: 1 }); // Ascending
userSchema.index({ age: -1 }); // Descending
```

**Compound Index:**
```javascript
userSchema.index({ firstName: 1, lastName: 1 });
```

**Unique Index:**
```javascript
userSchema.index({ email: 1 }, { unique: true });
```

**Text Index (for search):**
```javascript
userSchema.index({ name: 'text', bio: 'text' });
```

---

### Virtual Properties

**Computed Fields (not stored in DB):**
```javascript
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Usage:
const user = await User.findById(id);
console.log(user.fullName); // "John Doe"
```

**Virtual with Setter:**
```javascript
userSchema.virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  });
```

---

### Instance Methods

**Methods available on individual documents:**
```javascript
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email
  };
};

// Usage:
const user = await User.findById(id);
const profile = user.getPublicProfile();
```

**Async Instance Method:**
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

---

### Static Methods

**Methods available on the Model:**
```javascript
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Usage:
const user = await User.findByEmail('john@example.com');
```

**Static with Parameters:**
```javascript
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

userSchema.statics.findByAgeRange = function(min, max) {
  return this.find({ age: { $gte: min, $lte: max } });
};
```

---

### Middleware (Hooks)

**Pre Save:**
```javascript
// Runs before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

**Post Save:**
```javascript
// Runs after saving
userSchema.post('save', function(doc) {
  console.log(`User ${doc.name} was saved`);
});
```

**Pre Remove:**
```javascript
userSchema.pre('remove', async function(next) {
  // Delete user's posts when user is deleted
  await Post.deleteMany({ author: this._id });
  next();
});
```

**Pre Find:**
```javascript
// Runs before any find query
userSchema.pre('find', function() {
  this.where({ isDeleted: false }); // Auto-filter deleted users
});
```

---

### Complete Schema Example

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please enter valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // Don't include in queries by default
    },
    
    // Profile
    age: {
      type: Number,
      min: 0,
      max: 120
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    bio: {
      type: String,
      maxlength: 500
    },
    
    // Arrays
    tags: [String],
    skills: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
      }
    }],
    
    // References
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    // Status
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ firstName: 'text', lastName: 'text' });

// Virtual
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Instance Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.fullName,
    email: this.email,
    role: this.role
  };
};

// Static Methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password');
};

userSchema.statics.findActive = function() {
  return this.find({ isActive: true, isDeleted: false });
};

// Middleware
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model('User', userSchema);
```

---

### Schema Data Types Summary

| Type          | Mongoose Type                     | Use Case                           |
|---------------|-----------------------------------|------------------------------------|
| String        | `String`                          | Text data                          |
| Number        | `Number`                          | Integers, decimals                 |
| Boolean       | `Boolean`                         | True/false values                  |
| Date          | `Date`                            | Timestamps, dates                  |
| Array         | `[Type]`                          | Lists of items                     |
| Object        | `{}`                              | Nested data structures             |
| ObjectId      | `mongoose.Schema.Types.ObjectId`  | References to other documents      |
| Mixed         | `mongoose.Schema.Types.Mixed`     | Any type of data                   |
| Buffer        | `Buffer`                          | Binary data (images, files)        |
| Decimal128    | `mongoose.Schema.Types.Decimal128`| High precision numbers             |
| Map           | `Map`                             | Key-value pairs                    |

---