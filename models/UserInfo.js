const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  language: { type: String, required: true },
  referer: { type: String },
  screenSize: { type: String, required: true },
  timestamp: { type: String, required: true },
});

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;
