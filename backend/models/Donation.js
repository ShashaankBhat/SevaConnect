// models/Donation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Donation = sequelize.define(
  "Donation",
  {
    donation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    donor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "donors",
        key: "donor_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    ngo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ngos",
        key: "ngo_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    requirement_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "requirements",
        key: "requirement_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    donated_item: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },
    donated_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    pickup_or_drop: {
      type: DataTypes.ENUM("pickup", "drop"),
      allowNull: false,
      validate: {
        isIn: [["pickup", "drop"]],
      },
    },
    donation_status: {
      type: DataTypes.ENUM("pending", "received", "completed", "cancelled"),
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "received", "completed", "cancelled"]],
      },
    },
  },
  {
    tableName: "donations",
    timestamps: false,
    underscored: true,
    hooks: {
      beforeCreate: (donation) => {
        if (donation.donated_quantity < 1) {
          throw new Error("Donation quantity must be at least 1");
        }
      },
    },
  }
);

// Instance methods
Donation.prototype.isPending = function () {
  return this.donation_status === "pending";
};

Donation.prototype.isCompleted = function () {
  return this.donation_status === "completed";
};

Donation.prototype.canBeModified = function () {
  return this.donation_status === "pending";
};

module.exports = Donation;
