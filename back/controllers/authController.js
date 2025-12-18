const User = require("../models/User");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// 🔐 LOGIN (password check + QR or OTP)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ email });

  // user ما كاينش
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // password غلط
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // 🆕 new user → generate QR
  if (!user.secret) {
    const secret = speakeasy.generateSecret({
      name: `MyApp (${email})`
    });

    user.secret = secret.base32;
    await user.save();

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    return res.json({
      status: "NEW_USER",
      qr
    });
  }

  // 👤 existing user → OTP only
  return res.json({
    status: "EXISTING_USER"
  });
};

// 🆕 REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const secret = speakeasy.generateSecret({
    name: `MyApp (${email})`
  });

  const user = await User.create({
    email,
    password,
    secret: secret.base32
  });

  const qr = await QRCode.toDataURL(secret.otpauth_url);

  res.json({
    qr
  });
};


// ✅ VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, token } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: "base32",
    token,
    window: 1
  });

  if (!verified) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // هنا مستقبلاً دير JWT
  res.json({ success: true });
};
