const User = require("../models/User");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { hashDevice } = require("../utils/device");
//  LOGIN (password check + QR or OTP)
exports.login = async (req, res) => {
  const { email, password, deviceId } = req.body;

  if (!email || !password || !deviceId) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const deviceHash = hashDevice(deviceId);

  // trusted device → direct login
  const trusted = user.trustedDevices?.find(
    d => d.deviceHash === deviceHash
  );

  if (trusted && user.secret) {
    const token = jwt.sign(
      { id: user._id },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    return res.json({
      status: "LOGGED_IN",
      token,
      otpRequired: false
    });
  }

  // first time user → generate QR
  if (!user.secret) {
    const secret = speakeasy.generateSecret({
      name: `MyApp (${email})`
    });

    user.secret = secret.base32;
    await user.save();

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    return res.json({
      status: "NEW_USER",
      qr,
      otpRequired: true
    });
  }

  // known user but new device → ask OTP
  return res.json({
    status: "OTP_REQUIRED",
    otpRequired: true
  });
};

//  REGISTER
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


const jwt = require("jsonwebtoken");

//  VERIFY OTP

exports.verifyOtp = async (req, res) => {
  const { email, token, deviceId } = req.body;

  if (!email || !token || !deviceId) {
    return res.status(400).json({ message: "All fields required" });
  }

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

  //  trust this device
  const deviceHash = hashDevice(deviceId);

  const exists = user.trustedDevices.find(
    d => d.deviceHash === deviceHash
  );

  if (!exists) {
    user.trustedDevices.push({ deviceHash });
    await user.save();
  }

  const jwtToken = jwt.sign(
    { id: user._id },
    "SECRET_KEY",
    { expiresIn: "1h" }
  );

  res.json({
    status: "LOGGED_IN",
    token: jwtToken
  });
};

