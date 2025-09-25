// models/Donor.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Donor = sequelize.define(
  "Donor",
  {
    donor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    donor_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    donor_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    donor_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    donor_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    donor_preferences: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    donor_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    donor_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    donor_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "donors",
    timestamps: false,
  }
);

module.exports = Donor;
