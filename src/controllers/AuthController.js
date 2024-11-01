const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
    // Método para login
    async login(req, res) {
        const { email, password } = req.body;

        if(!email || !password)
            return res.status(400).json({ error: "Informe o email e senha" });

        try {
            // Busca o usuário pelo email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Usuário e/ou senha incorretos!" });
            }

            // Verifica se a senha é válida
            const validatePassword = bcrypt.compareSync(password, user.password);
            if (!validatePassword) {
                return res.status(400).json({ error: "Usuário e/ou senha incorretos!" });
            }

            // Gera o token JWT
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: "1h" // Expira em 1 hora
            });

            res.json({ mensagem: "Login realizado com sucesso!", token, user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ erro: error.message });
        }
    }

    // Método para verificar perfil protegido
    perfil(req, res) {
        const token = req.headers["authorization"];
        if (!token) return res.status(401).json({ erro: "Token não fornecido" });

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ erro: "Token inválido" });

            // Retorna o perfil do usuário decodificado do token
            res.json({ mensagem: "Bem-vindo ao seu perfil!", usuario: decoded });
        });
    }
}

module.exports = new AuthController();
