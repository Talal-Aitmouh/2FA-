const express = require("express");
const router = express.Router();


const {
  login,
  register,
  verifyOtp
} = require("../controllers/authController");


const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register);
router.post("/verify", verifyOtp);

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    userId: req.user.userId
  });
});

module.exports = router;
