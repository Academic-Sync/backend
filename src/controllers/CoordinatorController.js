const User = require('../models/User.js')
const EmailController = require('./EmailController');

class CoordinatorController {
    async index(req, res){
        try {
            const users = await User.findAll({
                where:{
                    user_type: 'coordinator'
                }
            });
            return res.json(users);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async store(req, res){
        try {
            const {  name, email, hashedPassword, password, code } = req.validatedData;

            const coordinator = await User.create({
                name, email, password: hashedPassword, user_type: 'coordinator', code
            })

            EmailController.sendPasswordEmail(coordinator, password);

            return res.json({message: "Coordenador criado", coordinator});
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

            // Verificar se o ID do Coordenador foi passado
            if (!user_id)
                return res.status(400).json({ error: 'ID do Coordenador não encontrado' });

            // Buscar o Coordenador no banco
            const coordinator = await User.findByPk(user_id);

            // Verificar se o Coordenador existe
            if (!coordinator)
                return res.status(404).json({ error: 'Coordenador não encontrado' });

            // Atualizar o Coordenador com os novos dados
            await coordinator.update({
                name, email, password: hashedPassword, code
            });

            return res.json({ message: 'Coordenador atualizado com sucesso', coordinator });
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
                return res.status(400).json({error: "Coordenador não encontrado"})

            await user.destroy();

            return res.status(200).json({message: "Coordenador apagado"})
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports = new CoordinatorController();