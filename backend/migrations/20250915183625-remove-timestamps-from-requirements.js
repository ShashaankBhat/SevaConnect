'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove problematic timestamp columns if they exist
    const table = await queryInterface.describeTable('requirements');

    if (table.created_at) {
      await queryInterface.removeColumn('requirements', 'created_at');
    }

    if (table.updated_at) {
      await queryInterface.removeColumn('requirements', 'updated_at');
    }
  },

  async down(queryInterface, Sequelize) {
    // Re-add the timestamp columns if you ever rollback
    await queryInterface.addColumn('requirements', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('requirements', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
