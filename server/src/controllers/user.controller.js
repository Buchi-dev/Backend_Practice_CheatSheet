const User = require("../models/user.model");

const getAllUsers = async (req, res) => {
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
const getUserById = async (req, res) => {
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
const deleteUser = async (req, res) => {
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
const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res
      .status(200)
      .json({ success: true, message: `${result.deletedCount} users deleted` });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
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
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  deleteAllUsers,
};
