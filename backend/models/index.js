const sequelize = require('../config/db');

// Import all models
const Donor = require('./Donor');
const NGO = require('./NGO');
const Admin = require('./Admin');
const Donation = require('./Donation');
const Requirement = require('./Requirement');
const Campaign = require('./Campaign');
const Newsletter = require('./Newsletter');
const InventoryItem = require('./InventoryItem');
const Request = require('./Request');

// ----------------------------
// Define Associations
// ----------------------------

// Donor - Donation
Donor.hasMany(Donation, { 
  foreignKey: 'donor_id', 
  as: 'donations',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Donation.belongsTo(Donor, { 
  foreignKey: 'donor_id', 
  as: 'donor'
});

// NGO - Donation
NGO.hasMany(Donation, { 
  foreignKey: 'ngo_id', 
  as: 'donations',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Donation.belongsTo(NGO, { 
  foreignKey: 'ngo_id', 
  as: 'ngo'
});

// NGO - Requirement
NGO.hasMany(Requirement, { 
  foreignKey: 'ngo_id', 
  as: 'requirements',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Requirement.belongsTo(NGO, { 
  foreignKey: 'ngo_id', 
  as: 'ngo'
});

// NGO - Campaign
NGO.hasMany(Campaign, { 
  foreignKey: 'ngo_id', 
  as: 'campaigns',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Campaign.belongsTo(NGO, { 
  foreignKey: 'ngo_id', 
  as: 'ngo'
});

// NGO - Request
NGO.hasMany(Request, { 
  foreignKey: 'ngo_id', 
  as: 'requests',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Request.belongsTo(NGO, { 
  foreignKey: 'ngo_id', 
  as: 'ngo'
});

// Donor - Request
Donor.hasMany(Request, { 
  foreignKey: 'donor_id', 
  as: 'requests',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Request.belongsTo(Donor, { 
  foreignKey: 'donor_id', 
  as: 'donor'
});

// Requirement - Donation
Requirement.hasMany(Donation, { 
  foreignKey: 'requirement_id', 
  as: 'donations',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Donation.belongsTo(Requirement, { 
  foreignKey: 'requirement_id', 
  as: 'requirement'
});

// ----------------------------
// Database Utilities
// ----------------------------

// Sync database
const syncDatabase = async (options = {}) => {
  try {
    const syncOptions = {
      alter: process.env.NODE_ENV === 'development',
      force: false,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      ...options
    };

    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    await sequelize.sync(syncOptions);
    console.log('✅ All models synchronized successfully');

    return true;
  } catch (error) {
    console.error('❌ Database synchronization failed:', error.message);

    if (error.name === 'SequelizeConnectionError') {
      console.error('💡 Check your database connection settings in .env file');
      console.error('💡 Ensure MySQL server is running');
      console.error('💡 Verify database name, user, and password');
    } else if (error.name === 'SequelizeDatabaseError') {
      console.error('💡 Check if your database exists and user has proper permissions');
      console.error('💡 Run: CREATE DATABASE sevaconnect;');
    } else if (error.name === 'SequelizeAccessDeniedError') {
      console.error('💡 Check database user credentials in .env file');
    }

    process.exit(1);
  }
};

// Reset database (development only)
const resetDatabase = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.error('❌ Database reset only allowed in development mode');
    return false;
  }

  try {
    console.log('🔄 Resetting database...');
    await sequelize.sync({ force: true });
    console.log('✅ Database reset successfully');
    return true;
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    return false;
  }
};

// Health check
const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    return { 
      status: 'healthy', 
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// ----------------------------
// Export Models and Utilities
// ----------------------------
module.exports = {
  sequelize,
  syncDatabase,
  resetDatabase,
  checkDatabaseHealth,
  Donor,
  NGO,
  Admin,
  Donation,
  Requirement,
  Campaign,
  Newsletter,
  InventoryItem,
  Request
};