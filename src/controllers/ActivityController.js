const Advisor = require('../models/Advisor');
const Activity = require('../models/Activity');
const Class = require('../models/Class');
const User = require('../models/User');
const EmailController = require('./EmailController');
const { Op } = require('sequelize');

class ActivityController {
    async index(req, res){
        try {
            const activities = await Activity.findAll();

            return res.json(activities);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async store(req, res){
        try {
            const { name, description, date, time, maximum_grade, teacher_id, class_id } = req.validatedData;
            const files = req.files.map(file => file.path);
            const file_path = JSON.stringify(files);

            const activity = await Activity.create({
                name, description, date, time, maximum_grade, teacher_id, class_id, file_path
            })

            return res.json({message: "Tarefa Criada", activity});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async find(req, res){
        try {
            const courses = await Activity.findOne({
                where: { id: req.params.activity_id },
            });
            return res.json(courses);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    
    async update(req, res) {
        try {
            const { activity_id } = req.params;
            const { name, description, date, time, maximum_grade, teacher_id, class_id } = req.validatedData;
            const files = req.files.map(file => file.path);
            const file_path = JSON.stringify(files);

            
            // Buscar o activity no banco
            const activity = await Activity.findByPk(activity_id);

            // Verificar se o activity existe
            if (!activity)
                return res.status(404).json({ error: 'Tarefa não encontrada' });

            
            await activity.update({
                name, description, date, time, maximum_grade, teacher_id, class_id, file_path
            });

            return res.json({ message: 'Tarefa atualizada com sucesso', activity });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async delete(req, res){
        try {
            const { activity_id }  = req.params;

            if(!activity_id)
                return res.status(400).json({error: 'ID não encontrado'});

            const activity = await Activity.findByPk(activity_id);

            if(!activity)
                return res.status(400).json({error: "Tarefa não encontrada"})

            await activity.destroy();

            return res.status(200).json({message: "Tarefa apagada"})
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports =  new ActivityController();