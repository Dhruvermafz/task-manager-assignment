// middlewares/auth.js
const jwt = require("./jwt.middleware"); // your jwt helper
const User = require("../models/user");

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")?.[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const validation = jwt.verifyToken(token);

  if (validation.error) {
    return res.status(401).json({
      success: false,
      message: validation.error.message || "Invalid or expired token",
    });
  }

  // Fetch full user + populated role
  const user = await User.findById(validation.userId).populate("role");
  if (!user || !user.isActive) {
    return res
      .status(401)
      .json({ success: false, message: "User not found or deactivated" });
  }

  req.user = {
    userId: user._id,
    email: user.email,
    role: user.role.name,
    permissions: user.role.permissions || [],
  };

  next();
};

/**
 * Authorize based on permissions
 * @param {...string} requiredPermissions
 * @param {Object} [options]
 * @param {boolean} [options.allowSelf=false] - allow user to act on their own resource
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const hasAllPermissions = requiredPermissions.every((perm) =>
      req.user.permissions.includes(perm),
    );

    // Special case: self-action allowed
    const isSelfAction =
      req.params.id && req.params.id === req.user.userId.toString();

    if (hasAllPermissions || (req.options?.allowSelf && isSelfAction)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Insufficient permissions",
    });
  };
};

module.exports = { authenticateUser, authorize };
