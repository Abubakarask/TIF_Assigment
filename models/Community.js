const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  _id: { type: String, required: true },

  name: {
    type: String,
    default: null,
  },

  slug: {
    type: String,
    unique: true,
  },

  owner: { type: String, ref: "User" },

  created_at: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Community = mongoose.model("Community", communitySchema);
module.exports = { Community };
