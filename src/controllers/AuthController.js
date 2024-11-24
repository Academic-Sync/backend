const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const PasswordHelper= require('../helpers/PasswordHelper'); // Importando o helper
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
    // Método para login
    async login(req, res) {
        const { login, password } = req.body;

        if(!login || !password)
            return res.status(400).json({ error: "Informe o login e senha" });

        try {
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        { code: login },
                        { email: login }
                    ]
                }
            });
            
            if (!user) {
                return res.status(400).json({ error: "Usuário e/ou senha incorretos!" });
            }

            // Verifica se a senha é válida
            const validatePassword = await PasswordHelper.compare( password, user.password);
            if (!validatePassword) {
                return res.status(400).json({ error: "Usuário e/ou senha incorretos!" });
            }

            // Gera o token JWT
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: "24h" // Expira em 1 hora
            });

            const response = {
                name: user.name,
                email: user.email,
                user_type: user.user_type,
                code: user.code,
                id: user.id
            };

            res.json({ mensagem: "Login realizado com sucesso!", token, user: response });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
    
    profile(req, res) {
        return res.json({user: req.user});
    }

    //atualiza conta
    async update(req, res) {
        try {
            const {  password, hashedPassword, email } = req.body;

            let user = await User.findByPk(req.user.id);
            
            if (!user) {
                return res.status(400).json({ error: "Dados não encontrados!" });
            }

            if(password.trim()){
                const hashedPassword = await PasswordHelper.encrypt(password);

                await user.update({
                    email, password: hashedPassword
                });
            }else{
                await user.update({
                    email
                });
            }

            res.json({ message: "Conta atualizada com sucesso!", user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
