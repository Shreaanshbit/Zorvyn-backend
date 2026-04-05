const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// it creates a new user with 'viewer' role and takes name , email, and password as the required feilds; also checks that its not an existing user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "viewer"
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// an existing user login , takes email and password as the required feilds also prevents inactive accounts from logging in 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error"
    });
  }
};

module.exports = { registerUser, loginUser };