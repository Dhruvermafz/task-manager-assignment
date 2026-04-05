const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controller/task.controller");

const { authenticateUser, authorize } = require("../middleware/authMiddleware");

// All routes are protected
router.use(authenticateUser);

router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.patch("/:id/status", updateTaskStatus);
router.delete("/:id", deleteTask);

module.exports = router;
