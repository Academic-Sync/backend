const Student = require('../models/Student');
const Class = require('../models/Class');
const User = require('../models/User');
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
                },
                include: {
                    model: Class,
                    as: 'classes',  // Alias configurado nas associações
                    through: { attributes: [] }  // Remove os atributos da tabela pivô (StudentClass) no retorno
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

            const finEmail = await User.findOne({
                where: {
                    email: email,
                }
            });

            if(finEmail)
                return res.status(400).json({error: "Esse email já está cadastrado"});

            const finStudent = await Student.findOne({
                where: {
                    code: code,
                }
            });

            if(finStudent)
                return res.status(400).json({error: "Aluno já cadastrado com esse RA"});

            const student = await Student.create({
                name, email, password: hashedPassword, user_type: "student", code
            })

            // se class_id foi enviado, insere aluno na turma
            if(req.body.class_id){
                let thisClass = await Class.findByPk(class_id); //class enviada pela requisição
                
                // verifica se aluno existe
                if(!thisClass)
                    return res.status(400).json({ message: 'Aluno criado, mas não inserido na turma. Essa turma não existe ou foi excluida' });


                // insere aluno na turma
                await StudentClass.create({
                    student_id: student.id,
                    classe_id: class_id,
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
                    as: 'classes',  // Alias configurado nas associações
                    through: { attributes: [] }  // Remove os atributos da tabela pivô (StudentClass) no retorno
                }
            });
            return res.json(courses);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    
    async storeByFile(req, res){
        try {
            const { students, class_id } = req.body;
            let existingStudent = [];
            let existingStudentClass = [];

            const thisClass = await Class.findByPk(class_id);

            for (const studentData of students) {
                const { ra, name, password } = studentData;
            
                //verifica se aluno existe
                let student = await Student.findOne({ where: { code: ra } });

                if (student) {
                    await student.update({ name });
                    existingStudent.push(student);

                    let studentClass = await StudentClass.findOne({ where: { student_id: student.id } });

                    if(!studentClass && thisClass){
                        await StudentClass.create({
                            student_id: student.id,
                            classe_id: class_id,
                        });
                        
                    }else{
                        existingStudentClass.push(student);
                    }
                } else{
                    const hashedPassword = await PasswordHelper.encrypt(password) 

                    student = await Student.create({
                        name: studentData.name,
                        password: hashedPassword, // Defina uma senha padrão ou gere uma
                        user_type: "student",
                        code: studentData.ra
                    });

                    if(thisClass){
                        // insere aluno na turma
                        await StudentClass.create({
                            student_id: student.id,
                            classe_id: class_id,
                        });
                    }
                    // EmailController.sendPasswordEmail(student, row['password']);
                }
            }

            let message = "Alunos cadastrados";

            return res.json({ message, existingStudent, existingStudentClass });
    
        } catch (error) {
            console.error(error);
            
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { user_id } = req.params;
            const {  name, email, password, hashedPassword, code, class_id } = req.body;


            // Verificar se o ID do Aluno foi passado
            if (!user_id)
                return res.status(400).json({ error: 'ID do Aluno não encontrado' });

            // Buscar o Aluno no banco
            const student = await Student.findByPk(user_id);

            // Verificar se o Aluno existe
            if (!student)
                return res.status(404).json({ error: 'Aluno não encontrado' });

            
            const finEmail = await User.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: user_id }
                }
            });

            if(finEmail)
                return res.status(400).json({error: "Esse email já está cadastrado"});

            const finStudent = await Student.findOne({
                where: {
                    code: code,
                    id: { [Op.ne]: user_id }
                }
            });

            if(finStudent)
                return res.status(400).json({error: "Aluno já cadastrado com esse código"});

            await student.update({
                name, email, code
            });
            

             // se class_id foi enviado, insere aluno na turma
            if(req.body.class_id){
                let thisClass = await Class.findByPk(class_id); //class enviada pela requisição

                // verifica se aluno existe
                if(!thisClass)
                    return res.status(400).json({ message: 'Aluno criado, mas não inserido na turma. Essa turma não existe ou foi excluida' });


                // insere aluno na turma
                await StudentClass.create({
                    student_id: student.id,
                    classe_id: class_id,
                });
            }

            return res.json({ message: 'Aluno atualizado com sucesso', student });
        } catch (error) {
            console.error(error);
            
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