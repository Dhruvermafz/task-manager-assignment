"use strict";

const Task = require("../models/task");

// Get all tasks (with optional filters)
exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority, assignee, search } = req.query;

    let query = { createdBy: req.user.userId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { assignee: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("[getAllTasks]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignee, dueDate, tags } =
      req.body;

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      assignee,
      dueDate,
      tags: tags || [],
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("[createTask]", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      updates,
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("[updateTask]", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("[deleteTask]", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

// Update only task status (for Kanban drag & drop)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      { status },
      { new: true, runValidators: true },
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission",
      });
    }

    res.json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("[updateTaskStatus]", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
    });
  }
};
