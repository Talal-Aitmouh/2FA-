const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/MyUser");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
