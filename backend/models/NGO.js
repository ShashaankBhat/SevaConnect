const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NGO = sequelize.define('NGO', {
  ngo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ngo_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  ngo_email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  ngo_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ngo_registration_no: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  ngo_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  ngo_address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ngo_contact: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'NGOs',
  timestamps: true
});

module.exports = NGO;
