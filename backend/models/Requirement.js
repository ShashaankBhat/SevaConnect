// models/Requirement.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Requirement = sequelize.define(
  "Requirement",
  {
    requirement_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ngo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ngos",
        key: "ngo_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    item_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    urgency: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
      validate: {
        isIn: [["low", "medium", "high"]],
      },
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("open", "fulfilled", "expired"),
      defaultValue: "open",
      validate: {
        isIn: [["open", "fulfilled", "expired"]],
      },
    },
  },
  {
    tableName: "requirements",
    timestamps: false,
    underscored: true,
    hooks: {
      beforeSave: (requirement) => {
        const now = new Date();
        if (requirement.expiry_date && new Date(requirement.expiry_date) < now) {
          requirement.status = "expired";
        }
        if (requirement.quantity <= 0) {
          requirement.status = "fulfilled";
        }
      },
    },
  }
);

// Instance methods
Requirement.prototype.isUrgent = function () {
  return this.urgency === "high";
};

Requirement.prototype.isExpired = function () {
  if (!this.expiry_date) return false;
  return new Date(this.expiry_date) < new Date();
};

Requirement.prototype.canAcceptDonations = function () {
  return this.status === "open" && !this.isExpired();
};

// Class methods
Requirement.findUrgentRequirements = function () {
  return this.findAll({
    where: {
      urgency: "high",
      status: "open",
    },
  });
};

module.exports = Requirement;
