const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donor = sequelize.define('Donor', {
  donor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  donor_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  donor_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  donor_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  donor_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  donor_phone: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Donors',
  timestamps: true
});

module.exports = Donor;
