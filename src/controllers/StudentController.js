const Student = require('../models/Student');
const Class = require('../models/Class');
const StudentClass = require('../models/StudentClass');
const EmailController = require('./EmailController');
const xlsx = require('xlsx');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const discordApiController = require('./DiscordApiController');
const PasswordHelper= require('../helpers/PasswordHelper'); // Importando o helper
const { Op } = require('sequelize');
const file = path.resolve('src/file.xlsx');

class StudentController {
    async index(req, res){
        discordApiController.sendErrorToDiscord("err.message");

        try {
            const users = await Student.findAll({
                where:{
                    user_type: "student"
                }
            });

            return res.json(users);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async store(req, res){
        try {
            const {  name, email, hashedPassword, password, code, class_id } = req.body;

            const finStudent = await Student.findOne({
                where: {
                    [Op.or]: [{code: code}, {email: email}]
                }
            });

            if(finStudent)
                return res.status(400).json({error: "Aluno Já cadastrado"});

            const student = await Student.create({
                name, email, hashedPassword, user_type: "student", code
            })

            // se class_id foi enviado, insere aluno na turma
            if(req.body.class_id){
                let thisClass = await Class.findByPk(class_id); //class enviada pela requisição
                
                // verifica se aluno existe
                if(!thisClass)
                    return res.status(400).json({ message: 'Aluno criado, mas não inserido na turma. Essa turma não existe ou foi excluida' });


                // insere aluno na turma
                await StudentClass.create({
                    student_id: student.id, class_id: class_id, ra: code
                });
            }

            if(email) EmailController.sendPasswordEmail(student, password);

            return res.json({message: "Aluno criado", student});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async find(req, res){
        try {
            const courses = await Student.findOne({
                where: { id: req.params.user_id },
                include: {
                    model: Class,
                    as: 'classes',
                    through: { attributes: [] } // Remove os atributos da tabela pivô no retorno
                }
            });
            return res.json(courses);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    

    async storeByFile(req, res){
        try {
            // Certifique-se de que o arquivo foi enviado
            if (!req.file) 
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            
    
            const wb = xlsx.readFile(req.file.path); // Utilize o caminho do arquivo enviado
            const ws = wb.Sheets["Sheet1"];
            const data = xlsx.utils.sheet_to_json(ws, { header: 1 }); // Captura os dados como matriz
    
            // Remove a primeira linha
            data.shift(); // Remove a primeira linha (cabeçalho)
            data.shift(); // Remove a segunda linha (cabeçalho)


            // Mapeia os dados restantes para um formato mais útil
            const students = data.map(row => {
                const formattedName = row[1].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                const password = PasswordHelper.encrypt(row[0].trim()); // senha = ra

                return {
                    ra: row[0].trim(),      // RA
                    name: formattedName,   // Nome
                    password: password,   // senha
                };
            });

            let existingStudent = [];  //inscrições que já existem
            let existingStudentClass = []; //inscrições que já existem

            for (const row of students) {
                const code = row['ra'];
                // Verifica se o email já existe
                let student = await Student.findOne({ where: { code } });

                if (student) {
                    existingStudent.push(student)
                } else{
                    student = await Student.create({
                        name: row['name'],
                        password: row['password'], // Defina uma senha padrão ou gere uma
                        user_type: "student",
                        code: row['ra']
                    });
                    EmailController.sendPasswordEmail(student, row['password']);
                }
            }

            // Apagar o arquivo após a leitura
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Erro ao apagar o arquivo:', err);
                }
            });

            let message = "Alunos cadastrados";

            if(existingStudentClass.length == students.length)
                message = "Os alunos já estão cadastrados";

            return res.json({ message, existingStudentClass });
    
        } catch (error) {
            console.error(error);
            
            return res.status(500).json({ error: error.message });
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
            const student = await Student.findByPk(user_id);

            // Verificar se o Aluno existe
            if (!student)
                return res.status(404).json({ error: 'Aluno não encontrado' });

            const finStudent = await Student.findOne({
                where: {
                    [Op.or]: [{code: code}, {email: email}],
                    id: { [Op.ne]: user_id }
                }
            });

            if(finStudent)
                return res.status(400).json({error: "Aluno já cadastrado com esse código ou email"});

            // Atualizar o Aluno com os novos dados
            await student.update({
                name, email, password, code
            });

             // se class_id foi enviado, insere aluno na turma
            if(req.body.class_id){
                let thisClass = await Class.findByPk(class_id); //class enviada pela requisição
                
                // verifica se aluno existe
                if(!thisClass)
                    return res.status(400).json({ message: 'Aluno criado, mas não inserido na turma. Essa turma não existe ou foi excluida' });


                // insere aluno na turma
                await StudentClass.create({
                    class_id: 12,
                    student_id: student.id
                });
            }

            return res.json({ message: 'Aluno atualizado com sucesso', student });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }


    async delete(req, res){
        try {
            const { user_id }  = req.params;

            if(!user_id)
                return res.status(400).json({error: 'ID não encontrado'});

            const user = await Student.findByPk(user_id);

            if(!user)
                return res.status(400).json({error: "Aluno não encontrado"})

            await user.destroy();

            return res.status(200).json({message: "Aluno apagado"})
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports =  new StudentController();