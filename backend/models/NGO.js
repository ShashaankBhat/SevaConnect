const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NGO = sequelize.define('NGO', {
  ngo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ngo_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ngo_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  ngo_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ngo_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ngo_phone: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  approval_status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending'
  }
}, {
  tableName: 'NGOs',
  timestamps: false
});

module.exports = NGO;