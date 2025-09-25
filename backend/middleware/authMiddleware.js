const jwt = require('jsonwebtoken');
const { Donor, NGO, Admin } = require('../models');
// ----------------------------
// Auth Middleware
// ----------------------------
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
        code: 'INVALID_TOKEN',
      });
    }

    // ----------------------------
    // Changed id → userId to match JWT payload
    // ----------------------------
    if (!decoded.userId || !decoded.role || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload.',
        code: 'INVALID_TOKEN_PAYLOAD',
      });
    }
    const { userId, role, email } = decoded;

    let user;
    switch (role) {
      case 'donor':
        user = await Donor.findByPk(userId, { attributes: { exclude: ['donor_password'] } });
        if (user && user.donor_email !== email) {
          return res.status(401).json({
            success: false,
            message: 'Token email mismatch.',
            code: 'EMAIL_MISMATCH',
          });
        }
        break;
      case 'ngo':
        user = await NGO.findByPk(userId, { attributes: { exclude: ['ngo_password'] } });
        if (user && user.ngo_email !== email) {
          return res.status(401).json({
            success: false,
            message: 'Token email mismatch.',
            code: 'EMAIL_MISMATCH',
          });
        }
        if (user && user.ngo_status !== 'approved') {
          return res.status(403).json({
            success: false,
            message: 'NGO account not approved. Please contact administrator.',
            code: 'NGO_NOT_APPROVED',
          });
        }
        break;
      case 'admin':
        user = await Admin.findByPk(userId, { attributes: { exclude: ['admin_password'] } });
        if (user && user.admin_email !== email) {
          return res.status(401).json({
            success: false,
            message: 'Token email mismatch.',
            code: 'EMAIL_MISMATCH',
          });
        }
        if (user && user.admin_status !== 'active') {
          return res.status(403).json({
            success: false,
            message: 'Admin account is inactive.',
            code: 'ADMIN_INACTIVE',
          });
        }
        break;
      default:
        return res.status(401).json({
          success: false,
          message: 'Invalid user role in token.',
          code: 'INVALID_ROLE',
        });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token may be invalid.',
        code: 'USER_NOT_FOUND',
      });
    }

    // ----------------------------
    // Attach userId instead of id
    // ----------------------------
    req.user = {
      userId: user[`${role}_id`],
      email: user[`${role}_email`],
      name: user[`${role}_name`],
      role: role,
      ...(role === 'donor' && { contact: user.donor_contact, preferences: user.donor_preferences }),
      ...(role === 'ngo' && { status: user.ngo_status, contact: user.ngo_contact, registrationNo: user.ngo_registration_no }),
      ...(role === 'admin' && { adminRole: user.admin_role, status: user.admin_status || 'active' }),
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
      code: 'AUTH_INTERNAL_ERROR',
    });
  }
};
// ----------------------------
// Role-Based Authorization Middleware
// ----------------------------
const requireRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
      code: 'AUTH_REQUIRED',
    });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions. Required roles: ' + roles.join(', '),
      code: 'INSUFFICIENT_PERMISSIONS',
    });
  }
  next();
};
const requireAdmin = requireRole(['admin']);
const requireDonor = requireRole(['donor']);
const requireNGO = requireRole(['ngo']);
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Superadmin access required.',
      code: 'SUPERADMIN_REQUIRED',
    });
  }
  if (req.user.adminRole !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Superadmin privileges required.',
      code: 'SUPERADMIN_PRIVILEGES_REQUIRED',
    });
  }
  next();
};
module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin,
  requireDonor,
  requireNGO,
  requireSuperAdmin,
};