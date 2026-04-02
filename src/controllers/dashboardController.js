const FinancialRecord = require("../models/FinancialRecord");

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

const User = require("../models/User");

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

module.exports = { getSummary,getOverview };