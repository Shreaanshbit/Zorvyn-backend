const express = require("express");
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require("../controllers/recordController");
const { protect } = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("admin","viewer"), createRecord);
router.get("/", protect, allowRoles("admin", "analyst", "viewer"), getRecords);
router.patch("/:id", protect, allowRoles("admin"), updateRecord);
router.delete("/:id", protect, allowRoles("admin"), deleteRecord);

module.exports = router;