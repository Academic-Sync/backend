const PasswordHelper = require('../helpers/PasswordHelper');

module.exports = async (req, res, next) => {
    try {
        let { name, email, password, code } = req.body;
        password = password ? password : PasswordHelper.generateRandomPassword(); //se tiver email, cria uma senha. Se não, a senha é o RA
        const hashedPassword = await PasswordHelper.encrypt(password);

        console.log(password);
        

        if(!name || !email)
            return res.status(400).json({error: 'Insira todos os campos'});

        req.body = { name, email, hashedPassword, password, code };

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};  
    