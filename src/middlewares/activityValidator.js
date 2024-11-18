const User = require('../models/User');
const Class = require('../models/Class');

module.exports =  async (req, res, next) => {
    const { name, description, date, time, maximum_grade, teacher_id } = req.body;

    // Verificar se todos os campos obrigatórios foram passados
    if(!name || !description || !date || !time || !maximum_grade)
        return res.status(400).json({error: 'Insira todos os campos'});

    const teacher = await User.findByPk(teacher_id);// Verificar se o professor existe
    
    if(!teacher)
        return res.status(400).json({error: 'Professor não encontrado'});

    const thisClass = await Class.findAll({
        where: { teacher_id: teacher.id } // Filtra pelas turmas do professor específico
    });

    if (thisClass.length === 0) {
        return res.status(400).json({ error: 'Nenhuma turma encontrada.' });
    }

    if(!thisClass)
        return res.status(400).json({error: 'Turma não encontrada'});

    const firstClassId = thisClass.length > 0 ? thisClass[0].id : null;
    const class_id = firstClassId

    req.validatedData = { name, description, date, time, maximum_grade, teacher_id, class_id };

    next();
};  
    