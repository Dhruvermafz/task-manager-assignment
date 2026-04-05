"use strict";

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      default: () => require("uuid").v4(),
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    assignee: {
      type: String, // username or full name
      trim: true,
    },

    dueDate: {
      type: Date,
    },

    tags: {
      type: [String],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "tasks",
    timestamps: true,
  },
);

// Virtual for nice display
taskSchema.virtual("statusLabel").get(function () {
  const map = {
    todo: "To Do",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
  };
  return map[this.status] || this.status;
});

module.exports = mongoose.model("Task", taskSchema);
