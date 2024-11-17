const User = require('./User')

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
            const { name, email, password, code } = req.validatedData;

            const user = await User.create({
                name, email, password, user_type: 'teacher', code
            })

            EmailController.sendPasswordEmail(user, password);

            return res.json({message: "Professor criado", user});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async update(req, res) {
        try {
            const { user_id } = req.params;
            const { name, email, password, code } = req.validatedData;

            // Verificar se o ID do Professor foi passado
            if (!user_id)
                return res.status(400).json({ error: 'ID do Professor não encontrado' });

            // Buscar o Professor no banco
            const user = await User.findByPk(user_id);

            // Verificar se o Professor existe
            if (!user)
                return res.status(404).json({ error: 'Professor não encontrado' });


            // Atualizar o Professor com os novos dados
            await user.update({
                name, email, password, code
            });

            return res.json({ message: 'Professor atualizado com sucesso', user });
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