const crypto = require("crypto");

exports.hashDevice = (deviceInfo) => {
  return crypto.createHash("sha256").update(deviceInfo).digest("hex");
};