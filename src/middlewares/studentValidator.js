const PasswordHelper = require('../helpers/PasswordHelper');

module.exports = async (req, res, next) => {
    try {
        let { name, email, password, code, class_id } = req.body;
        password = password ? password : PasswordHelper.generateRandomPassword(); //se tiver email, cria uma senha. Se não, a senha é o RA
        const hashedPassword = await PasswordHelper.encrypt(password);
        // password = email.trim() != "" ? PasswordHelper.generateRandomPassword() : code; //se tiver email, cria uma senha. Se não, a senha é o RA
        //const hashedPassword = await PasswordHelper.encrypt(password);

        if(!name || !code)
            return res.status(400).json({error: 'Insira todos os campos'});

        req.body = { name, email, hashedPassword, password, code, class_id };

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};  
    