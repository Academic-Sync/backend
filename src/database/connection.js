const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

// Importação dos modelos
const User = require('../models/User');
const Student = require('../models/Student');
const StudentClass = require('../models/StudentClass');
const Course = require('../models/Course');
const Class = require('../models/Class');
const Activity = require('../models/Activity');

const connection = new Sequelize(dbConfig);

connection.authenticate()
.catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
});

// Inicialização dos modelos
User.init(connection);
Student.init(connection);
StudentClass.init(connection);
Course.init(connection);
Class.init(connection);
Activity.init(connection);

// Associações
User.associate(connection.models);
Student.associate(connection.models);
// StudentClass.associate(connection.models);
Course.associate(connection.models);
Class.associate(connection.models);
Activity.associate(connection.models);

module.exports = connection;
