'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        coordinator_id: 5, // ID do Professor A
        name: 'Analise e Desenvolvimento de Sistemas',
        period: 'noite',
        type_work: 'Teórico',
        is_annual: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        coordinator_id: 6, // ID do Professor B
        name: 'Desenvolvimento de Sistemas',
        period: 'tarde',
        type_work: 'Prático',
        is_annual: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        coordinator_id: 5, // ID do Professor B
        name: 'Administração',
        period: 'noite',
        type_work: 'Prático',
        is_annual: false,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
