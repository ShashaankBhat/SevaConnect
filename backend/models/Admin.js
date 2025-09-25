// models/Admin.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Admin extends Model {}

Admin.init({
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  admin_email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  admin_password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  admin_role: {
    type: DataTypes.ENUM("superadmin", "moderator"),
    defaultValue: "superadmin",
    validate: {
      isIn: [['superadmin', 'moderator']]
    }
  },
  admin_status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
    validate: {
      isIn: [['active', 'inactive']]
    }
  }
}, {
  sequelize,
  modelName: 'Admin',
  tableName: 'admins',
  timestamps: false, // ✅ no createdAt/updatedAt
  underscored: true,
  hooks: {
    beforeCreate: (admin) => {
      if (admin.admin_email) {
        admin.admin_email = admin.admin_email.toLowerCase();
      }
    }
  }
});

// Instance methods
Admin.prototype.isSuperAdmin = function() {
  return this.admin_role === 'superadmin';
};

Admin.prototype.canManageUsers = function() {
  return this.admin_status === 'active' && this.admin_role === 'superadmin';
};

Admin.prototype.canModerateContent = function() {
  return this.admin_status === 'active';
};

module.exports = Admin;
