// routes/authRouter.js
const express = require("express");
const router = express.Router();

// Controllers
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getUserById,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

// Middlewares
const { authenticateUser } = require("../middleware/authMiddleware"); // verifies JWT + attaches req.user
const { authorize } = require("../middleware/authMiddleware"); // checks permissions
const isAdmin = require("../middleware/isAdmin"); // legacy – consider replacing with authorize("users:manage")

// ────────────────────────────────────────────────────────────────
// PUBLIC ROUTES (no authentication required)
// ────────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (default role: user)
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT
 * @access  Public
 */
router.post("/login", loginUser);

// ────────────────────────────────────────────────────────────────
// PROTECTED ROUTES (require valid JWT)
// ────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user's profile
 * @access  Private (authenticated user)
 */
router.get("/me", authenticateUser, getCurrentUser);

/**
 * @route   GET /api/auth/:id
 * @desc    Get any user by ID
 * @access  Private (self or users:read permission)
 */
router.get(
  "/:id",
  authenticateUser,
  authorize("users:read", { allowSelf: true }), // allow user to see own profile
  getUserById,
);

/**
 * @route   PUT /api/auth/:id
 * @desc    Update user profile (self or admin)
 * @access  Private (self or users:write)
 */
router.put(
  "/:id",
  authenticateUser,
  authorize("users:write", { allowSelf: true }),
  updateUser,
);

/**
 * @route   DELETE /api/auth/:id
 * @desc    Delete a user
 * @access  Private (users:delete) – prevent self-deletion in controller
 */
router.delete("/:id", authenticateUser, authorize("users:delete"), deleteUser);

// ────────────────────────────────────────────────────────────────
// ADMIN / MANAGEMENT ROUTES (higher privileges)
// ────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/auth
 * @desc    Get list of all users
 * @access  Private (users:read)
 */
router.get("/", getUsers);

/**
 * @route   POST /api/auth
 * @desc    Create a new user (admin tool)
 * @access  Private (users:write)
 */
router.post("/", authenticateUser, authorize("users:write"), addUser);

// Legacy route – consider deprecating in favor of permission-based checks
router.post("/add", authenticateUser, isAdmin, addUser);

module.exports = router;
