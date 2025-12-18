const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * AUTHENTICATION CONTROLLERS
 */

// Register new user
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, middleInitial, email, age, gender, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user (password will be hashed automatically by model middleware)
    const user = await User.create({
      firstName,
      lastName,
      middleInitial,
      email,
      age,
      gender,
      password,
      role: role || "staff", // Default to staff if not specified
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * USER CRUD CONTROLLERS
 */

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users)
      return res
        .status(404)
        .json({ success: false, message: "Users Not Found" });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};
const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const users = await User.findById(req.params.id);
    if (!users)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res
      .status(200)
      .json({ success: true, message: "User deleted", data: user });
  } catch (error) {
    next(error);
  }
};
const deleteAllUsers = async (req, res, next) => {
  try {
    const result = await User.deleteMany({});
    res
      .status(200)
      .json({ success: true, message: `${result.deletedCount} users deleted` });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const users = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!users)
      return res
        .status(404)
        .json({ success: false, message: "Users Not Found" });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Auth controllers
  register,
  login,
  getProfile,
  // User CRUD controllers
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  deleteAllUsers,
};
