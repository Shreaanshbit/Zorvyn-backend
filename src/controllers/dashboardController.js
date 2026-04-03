const FinancialRecord = require("../models/FinancialRecord");
const User = require("../models/User");
const mongoose = require("mongoose");

const getSummary = async (req, res) => {
  try {
    let match = {};

    if (req.user.role === "viewer") {
      match.createdBy = req.user._id;
    }

    const records = await FinancialRecord.find(match);

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((record) => {
      if (record.type === "income") {
        totalIncome += record.amount;
      } else {
        totalExpense += record.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    const recent = await FinancialRecord.find(match)
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalIncome,
      totalExpense,
      balance,
      recent
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecords = await FinancialRecord.countDocuments();

    const records = await FinancialRecord.find();

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((record) => {
      if (record.type === "income") {
        totalIncome += record.amount;
      } else {
        totalExpense += record.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    res.json({
      totalUsers,
      totalRecords,
      totalIncome,
      totalExpense,
      netBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsersOverview = async (req, res) => {
  try {
    const users = await User.find().select("name email");

    const overview = [];

    for (const user of users) {
      const records = await FinancialRecord.find({ createdBy: user._id });

      let totalIncome = 0;
      let totalExpense = 0;

      records.forEach((record) => {
        if (record.type === "income") {
          totalIncome += record.amount;
        } else {
          totalExpense += record.amount;
        }
      });

      overview.push({
        userId: user._id,
        name: user.name,
        email: user.email,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        recordCount: records.length
      });
    }

    res.json(overview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserDashboardById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const records = await FinancialRecord.find({ createdBy: id })
      .sort({ createdAt: -1 });

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryMap = {};

    records.forEach((record) => {
      if (record.type === "income") {
        totalIncome += record.amount;
      } else {
        totalExpense += record.amount;
      }

      if (!categoryMap[record.category]) {
        categoryMap[record.category] = {
          category: record.category,
          income: 0,
          expense: 0,
          total: 0
        };
      }

      if (record.type === "income") {
        categoryMap[record.category].income += record.amount;
      } else {
        categoryMap[record.category].expense += record.amount;
      }

      categoryMap[record.category].total += record.amount;
    });

    const categoryBreakdown = Object.values(categoryMap).sort(
      (a, b) => b.total - a.total
    );

    const recentActivity = records.slice(0, 5);

    res.json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        recordCount: records.length
      },
      categoryBreakdown,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
  getOverview,
  getUsersOverview,
  getUserDashboardById
};