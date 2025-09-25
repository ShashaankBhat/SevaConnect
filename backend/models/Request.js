// models/Request.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Request = sequelize.define(
  "Request",
  {
    request_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ngo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ngos",
        key: "ngo_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    donor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "donors",
        key: "donor_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    item_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        isInt: true
      }
    },
    urgency: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
      validate: {
        isIn: [['low', 'medium', 'high']]
      }
    },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "fulfilled", "cancelled", "expired"),
      defaultValue: "open",
      validate: {
        isIn: [['open', 'in_progress', 'fulfilled', 'cancelled', 'expired']]
      }
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0]
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "requests",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: (request) => {
        // Auto-update status based on deadline
        const now = new Date();
        
        if (request.deadline && new Date(request.deadline) < now && request.status === 'open') {
          request.status = 'expired';
        }
      }
    }
  }
);

// Instance methods
Request.prototype.isUrgent = function() {
  return this.urgency === 'high';
};

Request.prototype.isOpen = function() {
  return this.status === 'open';
};

Request.prototype.canBeFulfilled = function() {
  return this.status === 'open' || this.status === 'in_progress';
};

Request.prototype.markInProgress = async function() {
  if (this.status === 'open') {
    this.status = 'in_progress';
    return this.save();
  }
  throw new Error('Only open requests can be marked in progress');
};

Request.prototype.markFulfilled = async function() {
  if (this.status === 'in_progress') {
    this.status = 'fulfilled';
    return this.save();
  }
  throw new Error('Only in-progress requests can be fulfilled');
};

// Class methods
Request.findUrgentRequests = function(ngoId = null) {
  const whereClause = { 
    urgency: 'high',
    status: 'open'
  };
  
  if (ngoId) {
    whereClause.ngo_id = ngoId;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['deadline', 'ASC']],
    include: ['ngo']
  });
};

Request.getOpenRequests = function(ngoId = null) {
  const whereClause = { 
    status: ['open', 'in_progress']
  };
  
  if (ngoId) {
    whereClause.ngo_id = ngoId;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['urgency', 'DESC'], ['created_at', 'ASC']],
    include: ['ngo', 'donor']
  });
};

module.exports = Request;