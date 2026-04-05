const mongoose = require("mongoose");
const User = require("../models/User");
const FinancialRecord = require("../models/FinancialRecord");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (req.user._id.toString() === id && role && role !== user.role) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role"
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty"
        });
      }
      user.name = name.trim();
    }

    if (role !== undefined) {
      if (!["viewer", "analyst", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role"
        });
      }
      user.role = role;
    }

    if (status !== undefined) {
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status"
        });
      }
      user.status = status;
    }

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await FinancialRecord.deleteMany({ createdBy: id });

    await user.deleteOne();

    res.json({
      success: true,
      message: "User and related records deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser
};