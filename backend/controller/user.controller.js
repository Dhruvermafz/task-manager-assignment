"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("../middleware/jwt.middleware"); // your JWT helper
const User = require("../models/user");
const Role = require("../models/role"); // ← make sure this exists
const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: false,
};

const IMAGES_DIR = path.join(__dirname, "../images/users");

// Ensure directory exists (run once on startup)
(async () => {
  try {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create users images directory:", err);
  }
})();

// ────────────────────────────────────────────────
// Helper: Upload photo to FTP and return public URL
// ────────────────────────────────────────────────
const uploadPhotoToFTP = async (fileName) => {
  if (!fileName) return null;

  const client = new ftp.Client();
  try {
    await client.access(ftpConfig);

    const localPath = path.join(IMAGES_DIR, fileName);
    await fs.access(localPath); // will throw if not found

    const remoteFileName = `${uuidv4()}_${fileName.replace(/\s+/g, "-")}`;
    const remotePath = `users/${remoteFileName}`;

    await client.ensureDir("users");
    await client.uploadFrom(localPath, remotePath);

    // Clean up local file
    await fs.unlink(localPath);

    return `https://${ftpConfig.host}/${remotePath}`;
  } catch (err) {
    console.error(`FTP upload failed for ${fileName}:`, err.message);
    return null;
  } finally {
    client.close();
  }
};

// ────────────────────────────────────────────────
// REGISTER USER (public)
// ────────────────────────────────────────────────
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, photo } = req.body;

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    if (await User.findOne({ email: email.trim() })) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    if (username && (await User.findOne({ username: username.trim() }))) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    const defaultRole = await Role.findOne({ name: "user" });
    if (!defaultRole) {
      return res.status(500).json({
        success: false,
        message: "Default user role not found in database",
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const photoUrl = photo ? await uploadPhotoToFTP(photo) : undefined;

    const user = await User.create({
      username: username?.trim() || undefined,
      email: email.trim(),
      password: hashedPassword,
      role: defaultRole._id,
      photo: photoUrl,
    });

    const token = jwt.createToken({
      userId: user._id,
      role: defaultRole.name,
    });

    const populated = await user.populate("role");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: populated.role.name,
        photo: user.photo,
      },
      token,
    });
  } catch (error) {
    console.error("[registerUser]", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────
// LOGIN USER (public)
// ────────────────────────────────────────────────
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.trim() }).populate("role");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password.trim(), user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const token = jwt.createToken({
      userId: user._id,
      role: user.role.name,
      permissions: user.role.permissions,
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        photo: user.photo,
      },
      token,
    });
  } catch (error) {
    console.error("[loginUser]", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ────────────────────────────────────────────────
// GET CURRENT USER (authenticated)
// ────────────────────────────────────────────────
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("role");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions,
        photo: user.photo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("[getCurrentUser]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get current user",
    });
  }
};

// ────────────────────────────────────────────────
// GET ALL USERS (requires users:read permission)
// ────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    // You should already have checked permission in middleware
    const users = await User.find()
      .populate("role", "name")
      .select("-password");

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("[getUsers]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
// ────────────────────────────────────────────────
// GET USER BY ID (requires users:read or self)
// ────────────────────────────────────────────────
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const requester = req.user;

    const isSelf = requester.userId === userId;
    const canReadOthers = requester.permissions?.includes("users:read");

    if (!isSelf && !canReadOthers) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this user",
      });
    }

    const user = await User.findById(userId)
      .populate("role")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        permissions: user.role.permissions,
        photo: user.photo,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[getUserById]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};
// ────────────────────────────────────────────────
// UPDATE USER (self or users:write)
// ────────────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requester = req.user;

    const isSelf = requester.userId === userId;
    const canEditOthers = requester.role.permissions.includes("users:write");

    if (!isSelf && !canEditOthers) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { username, email, password, photo, role } = req.body;

    if (username?.trim()) user.username = username.trim();
    if (email?.trim()) user.email = email.trim();
    if (password?.trim()) {
      user.password = await bcrypt.hash(password.trim(), 10);
    }
    if (photo) {
      const photoUrl = await uploadPhotoToFTP(photo);
      if (photoUrl) user.photo = photoUrl;
    }

    // Only allow role change if requester has users:manage or is super admin
    if (role && requester.role.permissions.includes("users:manage")) {
      const newRole = await Role.findById(role);
      if (!newRole) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid role" });
      }
      user.role = newRole._id;
    }

    await user.save();

    const populated = await user.populate("role");

    return res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: populated.role.name,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("[updateUser]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// ────────────────────────────────────────────────
// DELETE USER (requires users:delete)
// ────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user._id.toString() === req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    await user.deleteOne();

    return res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("[deleteUser]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ────────────────────────────────────────────────
// ADMIN – CREATE USER (requires users:write)
// ────────────────────────────────────────────────
exports.addUser = async (req, res) => {
  try {
    const { username, email, password, photo, role: roleId } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (await User.findOne({ email: email.trim() })) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    let assignedRole;
    if (roleId) {
      assignedRole = await Role.findById(roleId);
      if (!assignedRole) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid role" });
      }
    } else {
      assignedRole = await Role.findOne({ name: "user" });
      if (!assignedRole) {
        return res.status(500).json({
          success: false,
          message: "Default user role not found",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const photoUrl = photo ? await uploadPhotoToFTP(photo) : undefined;

    const user = await User.create({
      username: username?.trim() || undefined,
      email: email.trim(),
      password: hashedPassword,
      role: assignedRole._id,
      photo: photoUrl,
    });

    const populated = await user.populate("role");

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: populated.role.name,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error("[addUser]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};
