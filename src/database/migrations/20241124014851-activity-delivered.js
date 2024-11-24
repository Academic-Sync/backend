'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('activities_delivered', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      file_path: {
        type: Sequelize.STRING,
        allowNull: true
      },

      activity_id: {
        type: Sequelize.INTEGER,
        references: { model: 'activities', key: 'id' },
        onUpdate: "CASCADE",
        onDelete: 'CASCADE',
        allowNull: false
      },

      student_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: "CASCADE",
        onDelete: 'CASCADE',
        allowNull: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
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
