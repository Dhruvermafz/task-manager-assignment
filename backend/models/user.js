// models/User.js
"use strict";

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // hashed!
    },
    photo: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/mern-travel-tourism.appspot.com/o/profile-photos%2F1706415975072defaultProfileImgttms125.png?alt=media&token=7f309b9e-7ccf-4a15-ba5c-829c9952a85c",
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

// Virtual for convenience
userSchema.virtual("roleName").get(function () {
  return this.role?.name || "unknown";
});

module.exports = mongoose.model("User", userSchema);
