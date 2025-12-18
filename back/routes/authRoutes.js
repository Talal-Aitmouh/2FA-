const express = require("express");
const router = express.Router();
const {
  login,
  register,
  verifyOtp
} = require("../controllers/authController");

router.post("/login", login);
router.post("/verify", verifyOtp);
router.post("/register", register); 

module.exports = router;
