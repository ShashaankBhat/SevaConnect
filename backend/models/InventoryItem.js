// models/InventoryItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InventoryItem = sequelize.define(
  "InventoryItem",
  {
    inventory_id: {
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
    item_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    category: {
      type: DataTypes.ENUM(
        "food", 
        "clothing", 
        "medical", 
        "educational", 
        "hygiene",
        "electronics",
        "furniture",
        "other"
      ),
      defaultValue: "other",
      validate: {
        isIn: [['food', 'clothing', 'medical', 'educational', 'hygiene', 'electronics', 'furniture', 'other']]
      }
    },
    current_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        isInt: true
      }
    },
    minimum_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 0,
        isInt: true
      }
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "units",
      validate: {
        notEmpty: true
      }
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0]
      }
    },
    storage_location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("in_stock", "low_stock", "out_of_stock", "expired"),
      defaultValue: "in_stock",
      validate: {
        isIn: [['in_stock', 'low_stock', 'out_of_stock', 'expired']]
      }
    }
  },
  {
    tableName: "inventory_items",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: (inventoryItem) => {
        const now = new Date();
        
        // Check expiry
        if (inventoryItem.expiry_date && new Date(inventoryItem.expiry_date) < now) {
          inventoryItem.status = 'expired';
          return;
        }

        // Check stock levels
        if (inventoryItem.current_quantity === 0) {
          inventoryItem.status = 'out_of_stock';
        } else if (inventoryItem.current_quantity <= inventoryItem.minimum_stock) {
          inventoryItem.status = 'low_stock';
        } else {
          inventoryItem.status = 'in_stock';
        }
      }
    }
  }
);

// Instance methods
InventoryItem.prototype.isLowStock = function() {
  return this.status === 'low_stock';
};

InventoryItem.prototype.isExpired = function() {
  return this.status === 'expired';
};

InventoryItem.prototype.canBeDonated = function() {
  return this.status === 'in_stock' && !this.isExpired();
};

InventoryItem.prototype.addStock = async function(quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be positive');
  }
  this.current_quantity += quantity;
  return this.save();
};

InventoryItem.prototype.removeStock = async function(quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be positive');
  }
  if (this.current_quantity < quantity) {
    throw new Error('Insufficient stock');
  }
  this.current_quantity -= quantity;
  return this.save();
};

// Class methods
InventoryItem.findLowStockItems = function(ngoId = null) {
  const whereClause = { status: 'low_stock' };
  if (ngoId) {
    whereClause.ngo_id = ngoId;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['current_quantity', 'ASC']]
  });
};

InventoryItem.findExpiredItems = function(ngoId = null) {
  const whereClause = { status: 'expired' };
  if (ngoId) {
    whereClause.ngo_id = ngoId;
  }
  
  return this.findAll({
    where: whereClause,
    order: [['expiry_date', 'ASC']]
  });
};

InventoryItem.getInventorySummary = async function(ngoId = null) {
  const whereClause = ngoId ? { ngo_id: ngoId } : {};
  
  const results = await this.findAll({
    where: whereClause,
    attributes: [
      'category',
      [sequelize.fn('SUM', sequelize.col('current_quantity')), 'total_quantity'],
      [sequelize.fn('COUNT', sequelize.col('inventory_id')), 'item_count']
    ],
    group: ['category']
  });
  
  return results;
};

module.exports = InventoryItem;
