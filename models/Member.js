const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  id: { type: String, require: true },
  community: { type: String, ref: "Community" },
  user: { type: String, ref: "User" },
  role: { type: String, ref: "Role" },
  created_at: { type: Date, default: Date.now },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
