const FinancialRecord = require("../models/FinancialRecord");

const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const record = await FinancialRecord.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecords = async (req, res) => {
  try {
    const records = await FinancialRecord.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRecord, getRecords };