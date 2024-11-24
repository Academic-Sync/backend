'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('activities_delivered', 'file_path', {
      type: Sequelize.TEXT, // Define como um array de strings
      allowNull: true, // Permite que o campo seja nulo, se necessário
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
