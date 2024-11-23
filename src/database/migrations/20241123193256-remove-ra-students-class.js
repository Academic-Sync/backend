'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('student_classes', 'ra', {
      type: Sequelize.STRING, // Define como um array de strings
      allowNull: true, // Permite que o campo seja nulo, se necessário
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('student_classes', 'ra', {
      type: Sequelize.STRING, // Define como um array de strings
      allowNull: false, // Permite que o campo seja nulo, se necessário
    });
  }
};
