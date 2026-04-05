const express = require("express");
const router = express.Router();

const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require("../controller/role.controller");

const { authenticateUser, authorize } = require("../middleware/authMiddleware");

// All routes require auth
//router.use(authenticateUser);

// ---------------- ROLES ----------------
router.get("/", getRoles);

router.post("/", createRole);

router.put("/:id", authorize("roles:manage"), updateRole);

router.delete("/:id", authorize("roles:manage"), deleteRole);

module.exports = router;
