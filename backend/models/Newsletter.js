// models/Newsletter.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Newsletter = sequelize.define('Newsletter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  subscribed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  unsubscribed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'newsletter',
  timestamps: false,
  underscored: true,
  hooks: {
    beforeCreate: (newsletter) => {
      if (newsletter.email) {
        newsletter.email = newsletter.email.toLowerCase().trim();
      }
    }
  }
});

// Instance methods
Newsletter.prototype.unsubscribe = async function() {
  this.unsubscribed_at = new Date();
  return this.save();
};

Newsletter.prototype.resubscribe = async function() {
  this.unsubscribed_at = null;
  this.subscribed_at = new Date();
  return this.save();
};

// Class methods
Newsletter.getActiveSubscribers = function() {
  return this.findAll({
    where: {
      unsubscribed_at: null
    }
  });
};

Newsletter.findByEmail = function(email) {
  if (!email) return null;
  return this.findOne({
    where: {
      email: email.toLowerCase().trim()
    }
  });
};

module.exports = Newsletter;
