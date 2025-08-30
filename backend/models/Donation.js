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
    donorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Donors",
        key: "donor_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    ngoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "NGOs",
        key: "ngo_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    requirement_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Requirements",
        key: "requirement_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    donated_item: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    donated_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pickup_or_drop: {
      type: DataTypes.ENUM("pickup", "drop"),
      allowNull: false,
    },
    donation_status: {
      type: DataTypes.ENUM("pending", "received", "completed"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Donations",
    timestamps: false, // We are managing created_at manually
  }
);

module.exports = Donation;