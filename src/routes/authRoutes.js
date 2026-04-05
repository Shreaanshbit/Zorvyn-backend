const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});
router.post("/register", protect, registerUser);
router.post("/login", protect,  loginUser);

module.exports = router;