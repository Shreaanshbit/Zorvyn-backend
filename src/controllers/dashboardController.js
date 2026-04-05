const FinancialRecord = require("../models/FinancialRecord");
const User = require("../models/User");
const mongoose = require("mongoose");

/*provides the basic dashboard with total income and expenses also includes category wise breakdown, 
 recent transactions and insights on the user's spending trends, mainly for a viewer to check their own spendings */ 
const getSummary = async (req, res) => {
  try {
    let match = {};

    if (req.user.role === "viewer") {
      match.createdBy = req.user._id;
    }

    const records = await FinancialRecord.find(match).sort({ createdAt: -1 });

    let totalIncome = 0;
    let totalExpense = 0;
    let highestIncome = null;
    let highestExpense = null;

    const categoryMap = {};
    const monthlyMap = {};

    records.forEach((record) => {
      if (record.type === "income") {
        totalIncome += record.amount;

        if (!highestIncome || record.amount > highestIncome.amount) {
          highestIncome = record;
        }
      } else {
        totalExpense += record.amount;

        if (!highestExpense || record.amount > highestExpense.amount) {
          highestExpense = record;
        }
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

      const recordDate = new Date(record.date);
      const month = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          month,
          income: 0,
          expense: 0
        };
      }

      if (record.type === "income") {
        monthlyMap[month].income += record.amount;
      } else {
        monthlyMap[month].expense += record.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    const categoryBreakdown = Object.values(categoryMap).sort(
      (a, b) => b.total - a.total
    );

    const monthlyTrends = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    const recent = records.slice(0, 5);

    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        balance,
        recordCount: records.length
      },
      categoryBreakdown,
      monthlyTrends,
      recent,
      insights: {
        highestIncome,
        highestExpense,
        topCategory
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* gives a global overview dashboard for the admin and analyst to check the total users registered and the total transactions being done on the application */
const getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecords = await FinancialRecord.countDocuments();

    const records = await FinancialRecord.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    let totalIncome = 0;
    let totalExpense = 0;
    let highestIncome = null;
    let highestExpense = null;

    const categoryMap = {};
    const monthlyMap = {};

    records.forEach((record) => {
      if (record.type === "income") {
        totalIncome += record.amount;

        if (!highestIncome || record.amount > highestIncome.amount) {
          highestIncome = record;
        }
      } else {
        totalExpense += record.amount;

        if (!highestExpense || record.amount > highestExpense.amount) {
          highestExpense = record;
        }
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

      const recordDate = new Date(record.date);
      const month = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          month,
          income: 0,
          expense: 0
        };
      }

      if (record.type === "income") {
        monthlyMap[month].income += record.amount;
      } else {
        monthlyMap[month].expense += record.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    const categoryBreakdown = Object.values(categoryMap).sort(
      (a, b) => b.total - a.total
    );

    const monthlyTrends = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    const recentActivity = records.slice(0, 5);

    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

    res.json({
      summary: {
        totalUsers,
        totalRecords,
        totalIncome,
        totalExpense,
        netBalance
      },
      categoryBreakdown,
      monthlyTrends,
      recentActivity,
      insights: {
        highestIncome,
        highestExpense,
        topCategory
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/*returns an overview dashboard for admin and analyst to check per user spending and over all analytics for per user */
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/*return a dashboard for a specific user searched using userId and provide all their transaction data and analytics  */
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

    const records = await FinancialRecord.find({ createdBy: id }).sort({ createdAt: -1 });

    let totalIncome = 0;
    let totalExpense = 0;
    let highestIncome = null;
    let highestExpense = null;

    const categoryMap = {};
    const monthlyMap = {};

    records.forEach((record) => {
      if (record.type === "income") {
        totalIncome += record.amount;

        if (!highestIncome || record.amount > highestIncome.amount) {
          highestIncome = record;
        }
      } else {
        totalExpense += record.amount;

        if (!highestExpense || record.amount > highestExpense.amount) {
          highestExpense = record;
        }
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

      const recordDate = new Date(record.date);
      const month = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          month,
          income: 0,
          expense: 0
        };
      }

      if (record.type === "income") {
        monthlyMap[month].income += record.amount;
      } else {
        monthlyMap[month].expense += record.amount;
      }
    });

    const categoryBreakdown = Object.values(categoryMap).sort(
      (a, b) => b.total - a.total
    );

    const monthlyTrends = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    const recentActivity = records.slice(0, 5);

    const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

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
      monthlyTrends,
      recentActivity,
      insights: {
        highestIncome,
        highestExpense,
        topCategory
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getSummary,
  getOverview,
  getUsersOverview,
  getUserDashboardById
};