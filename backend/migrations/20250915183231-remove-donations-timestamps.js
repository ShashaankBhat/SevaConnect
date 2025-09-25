'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove timestamps from donations table
    await queryInterface.removeColumn('donations', 'created_at').catch(() => {});
    await queryInterface.removeColumn('donations', 'updated_at').catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    // Re-add timestamps if needed
    await queryInterface.addColumn('donations', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('donations', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
