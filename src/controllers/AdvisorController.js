const Advisor = require('../models/Advisor');
const Class = require('../models/Class');
const User = require('../models/User');
const EmailController = require('./EmailController');
const { Op } = require('sequelize');

class AdvisorController {
    async index(req, res){
        try {
            const users = await Advisor.findAll({
                where:{
                    user_type: "advisor"
                }
            });

            return res.json(users);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async store(req, res){
        try {
            const {  name, email, hashedPassword, password, code } = req.body;

            const finEmail = await User.findOne({
                where: {
                    email: email,
                }
            });

            if(finEmail)
                return res.status(400).json({error: "Esse email já está cadastrado"});

            const finAdvisor = await Advisor.findOne({
                where: {
                    code: code,
                }
            });

            if(finAdvisor)
                return res.status(400).json({error: "Orientador já cadastrado com esse RA"});

            const advisor = await Advisor.create({
                name, email, hashedPassword, user_type: "advisor", code
            })

            EmailController.sendPasswordEmail(advisor, password);

            return res.json({message: "Orientador criado", advisor});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async find(req, res){
        try {
            const courses = await Advisor.findOne({
                where: { id: req.params.user_id },
            });
            return res.json(courses);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    
    async update(req, res) {
        try {
            const { user_id } = req.params;
            const {  name, email, password, code, class_id } = req.body;


            // Verificar se o ID do Aluno foi passado
            if (!user_id)
                return res.status(400).json({ error: 'ID do Aluno não encontrado' });

            // Buscar o Aluno no banco
            const advisor = await Advisor.findByPk(user_id);

            // Verificar se o Aluno existe
            if (!advisor)
                return res.status(404).json({ error: 'Aluno não encontrado' });

            
            const finEmail = await User.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: user_id }
                }
            });

            if(finEmail)
                return res.status(400).json({error: "Esse email já está cadastrado"});

            const finAdvisor = await Advisor.findOne({
                where: {
                    code: code,
                    id: { [Op.ne]: user_id }
                }
            });

            if(finAdvisor)
                return res.status(400).json({error: "Aluno já cadastrado com esse código"});

            // Atualizar o Aluno com os novos dados
            await advisor.update({
                name, email, password, code
            });

            return res.json({ message: 'Aluno atualizado com sucesso', advisor });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async delete(req, res){
        try {
            const { user_id }  = req.params;

            if(!user_id)
                return res.status(400).json({error: 'ID não encontrado'});

            const user = await Advisor.findByPk(user_id);

            if(!user)
                return res.status(400).json({error: "Orientador não encontrado"})

            await user.destroy();

            return res.status(200).json({message: "Orientador apagado"})
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports =  new AdvisorController();