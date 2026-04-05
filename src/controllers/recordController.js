const mongoose = require("mongoose");
const FinancialRecord = require("../models/FinancialRecord");

const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (amount === undefined || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Amount, type, category, and date are required"
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number"
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either income or expense"
      });
    }

    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required"
      });
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    const record = await FinancialRecord.create({
      amount,
      type,
      category: category.trim(),
      date: parsedDate,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Record created successfully",
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = {};

    if (req.user.role === "viewer") {
      filter.createdBy = req.user._id;
    }

    if (type) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid type filter"
        });
      }
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Both startDate and endDate are required"
        });
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date filter"
        });
      }

      filter.date = {
        $gte: parsedStartDate,
        $lte: parsedEndDate
      };
    }

    const records = await FinancialRecord.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID"
      });
    }

    const record = await FinancialRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    const isOwner =
      record.createdBy.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this record"
      });
    }

    if (amount !== undefined) {
      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be a positive number"
        });
      }
      record.amount = amount;
    }

    if (type !== undefined) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Type must be either income or expense"
        });
      }
      record.type = type;
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty"
        });
      }
      record.category = category.trim();
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format"
        });
      }

      record.date = parsedDate;
    }

    if (notes !== undefined) {
      record.notes = notes;
    }

    await record.save();

    res.json({
      success: true,
      message: "Record updated successfully",
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid record ID"
      });
    }

    const record = await FinancialRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found"
      });
    }

    const isOwner =
      record.createdBy.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this record"
      });
    }

    await record.deleteOne();

    res.json({
      success: true,
      message: "Record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};