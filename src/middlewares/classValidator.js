const User = require('../models/User');
const Course = require('../models/Course');

module.exports =  async (req, res, next) => {
    const { semester, teacher_id, course_id } = req.body;

    // Verificar se todos os campos obrigatórios foram passados
    if(!semester || !teacher_id || !course_id)
        return res.status(400).json({error: 'Insira todos os campos'});

    const user = await User.findByPk(teacher_id);// Verificar se o professor existe
    const course = await Course.findByPk(course_id);// Verificar se o curso existe
    
    if(!user)
        return res.status(400).json({error: 'Professor não encontrado'});

    if(!course)
        return res.status(400).json({error: 'Curso não encontrado'});

    req.validatedData = { semester, teacher_id, course_id };

    next();
};  
    