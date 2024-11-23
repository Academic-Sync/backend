'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('activities', 'file_path', {
      type: Sequelize.TEXT, // Define como um array de strings
      allowNull: true, // Permite que o campo seja nulo, se necessário
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('activities', 'file_path');
  }
};
