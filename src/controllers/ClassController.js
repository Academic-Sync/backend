const Class = require('../models/Class.js')
const User = require('../models/User.js')
const Course = require('../models/Course.js')

class ClassController {
    async index(req, res){
        try {
            const classes = await Class.findAll({
                include: [
                    {
                        model: User,
                        as: 'teacher',
                        attributes: ['name']
                    },
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['name', 'is_annual', 'period']
                    }
                ]
            });
            return res.json(classes);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async find(req, res){
        try {
            const thisClass = await Class.findOne({
                where: { id: req.params.course_id },
                include: [
                    {
                        model: User,
                        as: 'teacher',
                        attributes: ['name']
                    },
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['name', 'is_annual']
                    }
                ]
            });
            return res.json(thisClass);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async store(req, res){
        try {
            const { semester, teacher_id, course_id } = req.validatedData;

            // Cria o curso
            const newClass = await Class.create({
                semester, teacher_id, course_id
            })

            return res.json({message: "Turma criada", class: newClass});
        } catch (error) {
            return res.status(500).json({error: error.message, errormessage: error + ""});
        }
    }

    async update(req, res) {
        try {
            const { class_id } = req.params;
            const { semester, teacher_id, course_id } = req.validatedData;
            const updateClass = await Class.findByPk(class_id);

            // Verificar se a turma existe
            if (!updateClass)
                return res.status(404).json({ error: 'Turma não encontrada' });

            // Cria o curso
            await updateClass.update({
                semester, teacher_id, course_id
            })
            return res.json({ message: 'Turma atualizada com sucesso', updateClass });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async delete(req, res){
        try {
            const { class_id }  = req.params;

            if(!class_id)
                return res.status(400).json({error: 'ID não encontrado'});

            const thisClass = await Class.findByPk(class_id);

            if(!thisClass)
                return res.status(400).json({error: "Turma não encontrada"})

            await thisClass.destroy();

            return res.status(200).json({message: "Turma apagada"})
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports = new ClassController();