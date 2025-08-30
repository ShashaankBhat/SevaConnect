const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Newsletter = sequelize.define('Newsletter', {
  newsletter_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'Newsletter',
  timestamps: false
});

module.exports = Newsletter;