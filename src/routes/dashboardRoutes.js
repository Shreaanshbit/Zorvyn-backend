const express = require("express");
const { getSummary,getOverview, getUsersOverview } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/summary", protect, getSummary);
router.get("/overview", protect, allowRoles("analyst","admin"), getOverview);
router.get("/user-overview", protect, allowRoles("analyst","admin"), getUsersOverview);

module.exports = router;