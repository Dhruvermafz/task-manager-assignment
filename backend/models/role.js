// models/Role.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: {
      type: [String], // e.g. ["users:read", "users:write", "blogs:publish", "roles:manage"]
      default: [],
    },
    isSystemRole: {
      type: Boolean,
      default: false, // admin, user, etc. — protect from deletion
    },
  },
  {
    collection: "roles",
    timestamps: true,
  },
);

module.exports = mongoose.model("Role", roleSchema);
