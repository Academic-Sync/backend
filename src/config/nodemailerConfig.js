const nodemailer = require('nodemailer');
require('dotenv').config(); // Carregar variáveis do .env

// Criação do transportador
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // ou outro serviço de e-mail
    auth: {
        user: process.env.EMAIL_USER, // seu e-mail do .env
        pass: process.env.EMAIL_PASS, // sua senha de app do .env
    },
});

// Exporta o transportador para ser usado em outros arquivos
module.exports = transporter;