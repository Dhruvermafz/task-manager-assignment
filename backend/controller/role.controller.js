const Role = require("../models/role");

// ---------------- GET ALL ROLES ----------------
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    res.json({
      success: true,
      roles,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};

// ---------------- CREATE ROLE ----------------
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    const role = await Role.create({
      name,
      description,
      permissions,
    });

    res.status(201).json({
      success: true,
      role,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create role" });
  }
};

// ---------------- UPDATE ROLE ----------------
exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false });
    }

    if (role.isSystemRole) {
      return res.status(403).json({
        success: false,
        message: "System roles cannot be modified",
      });
    }

    Object.assign(role, req.body);
    await role.save();

    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ---------------- DELETE ROLE ----------------
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) return res.status(404).json({ success: false });

    if (role.isSystemRole) {
      return res.status(403).json({
        success: false,
        message: "System roles cannot be deleted",
      });
    }

    await role.deleteOne();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
