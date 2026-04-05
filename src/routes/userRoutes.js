const express = require("express");
const router = express.Router();

const { getAllUsers, updateUser, deleteUser } = require("../controllers/userController");
const {protect} = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");

router.get("/", protect, allowRoles("admin"), getAllUsers);
router.patch("/:id", protect,  allowRoles("admin"), updateUser);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

module.exports = router;