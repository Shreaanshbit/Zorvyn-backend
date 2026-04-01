const express = require("express");
const { createRecord, getRecords } = require("../controllers/recordController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createRecord);
router.get("/", protect, getRecords);

module.exports = router;