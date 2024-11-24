const User = require('../models/User');
const Class = require('../models/Class');

module.exports =  async (req, res, next) => {
    const { activity_id } = req.body;

    // Verificar se todos os campos obrigatórios foram passados
    if(!activity_id)
        return res.status(400).json({error: 'Atividade não encontrada'});

    req.validatedData = { activity_id };

    next();
};  
    