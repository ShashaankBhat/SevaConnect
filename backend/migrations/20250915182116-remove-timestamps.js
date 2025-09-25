'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Donors table
    await queryInterface.removeColumn('donors', 'created_at').catch(() => {});
    await queryInterface.removeColumn('donors', 'updated_at').catch(() => {});

    // NGOs table
    await queryInterface.removeColumn('ngos', 'created_at').catch(() => {});
    await queryInterface.removeColumn('ngos', 'updated_at').catch(() => {});

    // Admins table
    await queryInterface.removeColumn('admins', 'created_at').catch(() => {});
    await queryInterface.removeColumn('admins', 'updated_at').catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    // Re-add columns if needed
    await queryInterface.addColumn('donors', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('donors', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('ngos', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('ngos', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('admins', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('admins', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
