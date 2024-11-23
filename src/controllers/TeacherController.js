const { password } = require('../config/database.js');
const User = require('../models/User.js')
const EmailController = require('./EmailController');
const { Op } = require('sequelize');

class TeacherController {
    async index(req, res){
        try {
            const users = await User.findAll({
                where:{
                    user_type: 'teacher'
                }
            });
            return res.json(users);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async store(req, res){
        try {
            const { name, email, password, hashedPassword, code } = req.validatedData;

            const finEmail = await User.findOne({
                where: {
                    email: email,
                }
            });

            if(finEmail)
                return res.status(400).json({error: "Esse email já está cadastrado"});

            const finTeacher = await User.findOne({
                where: {
                    code: code,
                }
            });

            if(finTeacher)
                return res.status(400).json({error: "Professor já cadastrado com esse código"});

            const teacher = await User.create({
                name, email, password: hashedPassword, user_type: 'teacher', code
            })

            EmailController.sendPasswordEmail(teacher, password);

            return res.json({message: "Professor criado", teacher});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async find(req, res){
        try {
            const teacher = await User.findOne({
                where: { id: req.params.user_id }
            });
            return res.json(teacher);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    

    async update(req, res) {
        try {
            const { user_id } = req.params;
            const { name, email, hashedPassword, code } = req.validatedData;

            // Verificar se o ID do Professor foi passado
            if (!user_id)
                return res.status(400).json({ error: 'ID do Professor não encontrado' });

            // Buscar o Professor no banco
            const teacher = await User.findByPk(user_id);

            // Verificar se o Professor existe
            if (!teacher)
                return res.status(404).json({ error: 'Professor não encontrado' });

            const finEmail = await User.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: user_id }
                }
            });

            if(finEmail)
                return res.status(400).json({error: "Esse email já está cadastrado"});

            const finTeacher = await User.findOne({
                where: {
                    code: code,
                    id: { [Op.ne]: user_id }
                }
            });

            if(finTeacher)
                return res.status(400).json({error: "Professor já cadastrado com esse código"});

            // Atualizar o Professor com os novos dados
            //se tiver passado senha
            if(password.trim()){
                await teacher.update({
                    name, email, password: hashedPassword, code
                });
            }else{
                await teacher.update({
                    name, email, code
                }); 
            }

            return res.json({ message: 'Professor atualizado com sucesso', teacher });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }


    async delete(req, res){
        try {
            const { user_id }  = req.params;

            if(!user_id)
                return res.status(400).json({error: 'ID não encontrado'});

            const user = await User.findByPk(user_id);

            if(!user)
                return res.status(400).json({error: "Professor não encontrado"})

            await user.destroy();

            return res.status(200).json({message: "Professor apagado"})
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports =  new TeacherController();