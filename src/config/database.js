const dotenv = require('dotenv')
dotenv.config();

const dbConfig = {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialectOptions: {
        ssl: process.env.DB_HOST === 'localhost' ? false : {
            require: true, // Exige SSL para conexões remotas
            rejectUnauthorized: false,
        },
    },
    port: process.env.DB_PORT, 
    define: {
        timestamps: true,
        underscored: true, // Define que os nomes de colunas e tabelas serão em snake_case
    },
}

module.exports = dbConfig;