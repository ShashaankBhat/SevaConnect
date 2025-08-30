const { DataTypes, Model } = require("sequelize");

class Admin extends Model {
  static initModel(sequelize) {
    Admin.init(
      {
        admin_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        admin_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        admin_email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        admin_password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        admin_role: {
          type: DataTypes.ENUM("superadmin", "moderator"),
          defaultValue: "superadmin",
        },
        admin_status: {
          type: DataTypes.ENUM("active", "inactive"),
          defaultValue: "active",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "admins",
        timestamps: true,
      }
    );
  }
}

module.exports = Admin;