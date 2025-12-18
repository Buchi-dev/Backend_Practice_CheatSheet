const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define User Schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z ]+$/,
    minlength: 2,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z]+$/,
    minlength: 2,
    maxlength: 30,
  },
  middleInitial: {
    type: String,
    trim: true,
    match: /^[A-Za-z]+$/,
    maxlength: 3,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: /^[\w.-]+@smu\.edu\.ph$/,
    unique: true,
    minlength: 10,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Don't return password by default in queries
  },
  age: {
    type: Number,
    required: true,
    trim: true,
    min: 1,
    max: 500,
  },
  gender: {
    type: String,
    enum: ["male", "female", "rather not say"],
    required: true,
  },
  role: {
    type: String,
    enum: ["staff", "admin"],
    required: true,
    default: "staff",
  },
}, {
  timestamps: true, // Add createdAt and updatedAt
});

// Hash password before saving
UserSchema.pre("save", async function () {
  // Only hash if password is new or modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON responses
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
