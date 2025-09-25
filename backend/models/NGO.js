// models/NGO.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const NGO = sequelize.define("NGO", {
  ngo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ngo_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ngo_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  ngo_password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ngo_registration_no: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  ngo_contact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ngo_status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending"
  }
}, {
  tableName: "ngos",
  timestamps: false
});

module.exports = NGO;
