const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        const token = req.headers['authorization']; // O token geralmente é passado no cabeçalho Authorization

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido.' });
        }
    
        // Remove o "Bearer" se o token for passado assim
        const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        jwt.verify(tokenWithoutBearer, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Faça login novamente.' });
            }
    
            // Adiciona o usuário decodificado (id, email e tipo) na requisição
            // req.user = {
            //     id: decoded.id,
            //     email: decoded.email,
            //     user_type: decoded.user_type // Inclua o tipo no payload do JWT
            // };

            req.user = await User.findOne({
                where: { id: decoded.id },
            });
    
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
