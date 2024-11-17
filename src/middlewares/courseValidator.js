const User = require('../models/User');

module.exports = async (req, res, next) => {
    const { coordinator_id, name, period, is_annual, type_work } = req.body;

    // Verificar se todos os campos obrigatórios foram passados
    if(!coordinator_id || !name || !period || !is_annual || !type_work)
        return res.status(400).json({error: 'Insira todos os campos'});

    // Verificar se o coordenador existe
    const coordinator = await User.findByPk(coordinator_id);

    if(!coordinator)
        return res.status(400).json({error: 'Coordenador não encontrado'});

    req.validatedCourseData = { coordinator_id, name, period, is_annual, type_work };

    next();
};  
    