const Course = require('../models/Course.js')
const User = require('../models/User.js')

class CourseController {
    async index(req, res){
        try {
            const { user_type, id } = req.user; // Pegando o tipo do usuário e ID

            let courses;

            courses = await Course.findAll({
                include: [
                    {
                        model: User,
                        as: 'coordinator',
                        attributes: ['name']
                    }
                ]
            });
            
            
            return res.json(courses);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async store(req, res){
        try {
            const { coordinator_id, name, period, is_annual, type_work } = req.validatedCourseData;

            // Cria o curso
            const course = await Course.create({
                coordinator_id, name, period, type_work, is_annual
            })

            return res.json({message: "Curso criado", course});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async find(req, res){
        try {
            const courses = await Course.findOne({
                where: { id: req.params.course_id },
                include: [
                    {
                        model: User,
                        as: 'coordinator',
                        attributes: ['name']
                    }
                ]
            });
            return res.json(courses);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async update(req, res) {
        try {
            const { course_id } = req.params;
            const { coordinator_id, name, period, is_annual, type_work } = req.validatedCourseData;

            const course = await Course.findByPk(course_id);// Buscar o curso no banco

            // Verificar se o curso existe
            if (!course)
                return res.status(404).json({ error: 'Curso não encontrado' });

            // Atualizar o curso
            await course.update({
                coordinator_id, name, period, is_annual, type_work
            });

            return res.json({ message: 'Curso atualizado com sucesso', course });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async delete(req, res){
        try {
            const { course_id }  = req.params;

            if(!course_id)
                return res.status(400).json({error: 'ID não encontrado'});

            const course = await Course.findByPk(course_id);

            if(!course)
                return res.status(400).json({error: "Curso não encontrado"})

            await course.destroy();

            return res.status(200).json({message: "Curso apagado"})
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports = new CourseController();