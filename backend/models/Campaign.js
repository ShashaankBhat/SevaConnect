// models/Campaign.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Campaign = sequelize.define(
  "Campaign",
  {
    campaign_id: {
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
    campaign_title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200]
      }
    },
    campaign_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    campaign_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0]
      }
    },
    campaign_location: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    campaign_requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("upcoming", "ongoing", "completed", "cancelled"),
      defaultValue: "upcoming"
    }
  },
  {
    tableName: "campaigns",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: (campaign) => {
        // Auto-update status based on date
        const now = new Date();
        const campaignDate = new Date(campaign.campaign_date);
        
        if (campaignDate < now) {
          campaign.status = 'completed';
        } else if (campaignDate.toDateString() === now.toDateString()) {
          campaign.status = 'ongoing';
        }
      }
    }
  }
);

// Instance methods
Campaign.prototype.isUpcoming = function() {
  return this.status === 'upcoming';
};

Campaign.prototype.isOngoing = function() {
  return this.status === 'ongoing';
};

Campaign.prototype.canBeEdited = function() {
  return this.status === 'upcoming';
};

// Class methods
Campaign.getUpcomingCampaigns = function() {
  return this.findAll({
    where: {
      status: 'upcoming'
    },
    order: [['campaign_date', 'ASC']]
  });
};

Campaign.getOngoingCampaigns = function() {
  return this.findAll({
    where: {
      status: 'ongoing'
    }
  });
};

module.exports = Campaign;