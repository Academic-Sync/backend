import { Request, Response } from "express";

import Student from '../models/Student';
import Class from '../models/Class';
import StudentClass from '../models/StudentClass';
import EmailController from './EmailController';
import xlsx from 'xlsx';
import _ from 'lodash';
import fs from 'fs';
import bcrypt from 'bcrypt';
import PasswordHelper from "../helpers/PasswordHelper";
import { ModelStatic } from "sequelize";

type StudentFile = [string, string, string, string];

class StudentController {
    private Student: ModelStatic<Student> = Student;

    async index(req: Request, res: Response){
        try {
            const users = await Student.findAll({
                where:{
                    user_type: "student"
                }
            });
            return res.json(users);
        } catch (error: any) {
            return res.status(500).json({error: error.message});
        }
    }

    async store(req: Request, res: Response){
        try {
            const {  name, email, hashedPassword, password, code } = req.body;
            const user = await Student.create({
                name, email, password: hashedPassword, user_type: "student", code
            })

            EmailController.sendPasswordEmail(user, password);

            return res.json({message: "Aluno criado", user});
        } catch (error: any) {
            return res.status(500).json({error: error.message});
        }
    }

    async storeByFile(req: Request, res: Response){
        try {
            // Certifique-se de que o arquivo foi enviado
            if (!req.file) 
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            
    
            const wb = xlsx.readFile(req.file.path); // Utilize o caminho do arquivo enviado
            const ws = wb.Sheets["Sheet1"];
            const data = xlsx.utils.sheet_to_json(ws, { header: 1 }); // Captura os dados como matriz
    
            // Remove a primeira e segunda linha (cabeçalho)
            data.shift(); 
            data.shift();


            // Mapeia os dados restantes para um formato mais útil
            const students = (data as StudentFile[]).map((row: StudentFile) => {
                const formattedName = row[1].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                const nameParts = formattedName.split(' ');
                const firstName = nameParts[0]; // Primeiro nome
                const lastName = nameParts[nameParts.length - 1]; // Último sobrenome
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@fatec.sp.gov.br`;
                const password = PasswordHelper.generateRandomPassword();
            
                return {
                    ra: row[0].trim(),      // RA
                    name: formattedName,    // Nome
                    email: email,           // Email
                    password: password,     // Senha
                };

                    // p1: row[2],         // P1
                    // p2: row[3],         // P2
                    // p3: row[4],         // P3
                    // p4: row[5],         // P4
                    // average: row[6],    // Média
            });

            let existingStudent = [];  //inscrições que já existem
            let existingStudentClass = []; //inscrições que já existem

            for (const row of students) {
                const email = row['email'];
                // Verifica se o email já existe
                let student = await this.Student.findOne({ where: { email } });

                if (student) {
                    existingStudent.push(student)
                } else{
                    const hashedPassword = await PasswordHelper.encrypt(row['password']);

                    student = await Student.create({
                        name: row['name'],
                        email: row['email'],
                        password: hashedPassword, // Defina uma senha padrão ou gere uma
                        user_type: "student",
                        code: row['ra']
                    });
                    EmailController.sendPasswordEmail(student, row['password']);
                }

                if(req.body.class_id){
                    let thisClass = await Class.findByPk(req.body.class_id);
                    let student_class = await StudentClass.findOne({ 
                        where: {
                            class_id: req.body.class_id,
                            student_id: student.id
                        }
                    });

                    if(!thisClass)
                        return res.status(400).json({ message: 'Essa turma não existe ou foi excluida' });

                    if(student_class){
                        existingStudentClass.push(student)
                    } else {
                        await StudentClass.create({
                            student_id: student.id, class_id: req.body.class_id, ra: row['ra']
                        });
                    }
                }
            }

            // Apagar o arquivo após a leitura
            fs.unlink(req.file.path, (err: any) => {
                if (err) {
                    console.error('Erro ao apagar o arquivo:', err);
                }
            });

            let message = "Alunos cadastrados";

            if(existingStudentClass.length == students.length)
                message = "Os alunos já estão cadastrados";

            return res.json({ message, existingStudentClass });
    
        } catch (error: any) {
            console.error(error);
            
            return res.status(500).json({ error: error.message });
        }
    }


    async update(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
            const {  name, email, password, code } = req.body;

            // Verificar se o ID do Aluno foi passado
            if (!user_id)
                return res.status(400).json({ error: 'ID do Aluno não encontrado' });

            // Buscar o Aluno no banco
            const user = await Student.findByPk(user_id);

            // Verificar se o Aluno existe
            if (!user)
                return res.status(404).json({ error: 'Aluno não encontrado' });

            // Atualizar o Aluno com os novos dados
            await user.update({
                name, email, password, code
            });

            return res.json({ message: 'Aluno atualizado com sucesso', user });
        } catch (error: any) {
            return res.status(500).json({error: error.message});
        }
    }


    async delete(req: Request, res: Response){
        try {
            const { user_id }  = req.params;

            if(!user_id)
                return res.status(400).json({error: 'ID não encontrado'});

            const user = await Student.findByPk(user_id);

            if(!user)
                return res.status(400).json({error: "Aluno não encontrado"})

            await user.destroy();

            return res.status(200).json({message: "Aluno apagado"})
        } catch (error: any) {
            return res.status(500).json({error: error.message});
        }
    }
}

export default new StudentController();