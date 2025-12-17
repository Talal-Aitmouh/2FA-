const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./model/User');
const Qrcode = require('qrcode');
const speakeasy = require('speakeasy');


const app = express();
app.use(cors());
mongoose.connect("mongodb://localhost:27017/MyUser").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});
app.use(express.json());

// generate secret & code qr
app.post('/generate', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const secret = speakeasy.generateSecret({
    name: `MyApp (${email})`
  });

  await User.create({
    email,
    password,
    secret: secret.base32
  });

  Qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      return res.status(500).json({ message: 'Error generating QR code' });
    }
    res.json({ data_url });
  });
});



// verify code otp using stored secret
app.post('/verify', async (req, res) => {
    const {email, token} = req.body;

    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({message: 'User not found'});
    }

    const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token,
        window: 1
    });

    res.status(200).json({verified});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}   );