const express = require("express");
const { getSummary,getOverview } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/summary", protect, getSummary);
router.get("/overview", protect, allowRoles("analyst","admin"), getOverview);

module.exports = router;