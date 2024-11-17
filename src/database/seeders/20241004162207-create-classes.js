'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Classes', [
      {
        semester: 1,
        teacher_id: 3, 
        course_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        semester: 2,
        teacher_id: 3, 
        course_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        semester: 1,
        teacher_id: 4, 
        course_id: 2,
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
