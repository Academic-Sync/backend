const transporter = require('../config/nodemailerConfig'); // Importando a configuração do nodemailer

class EmailController {
    async sendPasswordEmail(user, password) {

        if(process.env.SEND_MAIL == 1){
            const mailOptions = {
                from: process.env.EMAIL_USER, // seu e-mail do .env
                to: user.email, // e-mail do destinatário
                subject: 'Sua nova senha gerada',
                text: `Olá ${user.name},\n\nSua nova senha é: ${password}\n\nPor favor, altere sua senha após o primeiro acesso.\n\nAtenciosamente,\nSua Equipe.`,
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                // throw new Error('Erro ao enviar e-mail com a senha');
            }
        }
    }
}

module.exports = new EmailController();