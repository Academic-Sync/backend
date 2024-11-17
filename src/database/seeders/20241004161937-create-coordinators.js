re'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = 10;

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Coordenador',
        email: 'coordenador@gmail.com',
        password: await bcrypt.hash('123', saltRounds),
        user_type: 'coordinator',
        code: '123456',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Coordenador 2',
        email: 'coordenador2@gmail.com',
        password: await bcrypt.hash('123', saltRounds),
        user_type: 'coordinator',
        code: '123456',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
