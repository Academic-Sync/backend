const Advisor = require('../models/Advisor');
const Activity = require('../models/Activity');
const ActivityDelivered = require('../models/ActivityDelivered');
const Class = require('../models/Class');
const User = require('../models/User');
const EmailController = require('./EmailController');
const { Op } = require('sequelize');
const Student = require('../models/Student');
const StudentClass = require('../models/StudentClass');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

class ActivityController {
    async index(req, res){
        try {
            let activities = await Activity.findAll();

            if(req.user.user_type == 'teacher'){ //professor
                activities = await Activity.findAll({
                    where: {
                        teacher_id: req.user.id
                    }
                });
            }else if(req.user.user_type == 'student'){ //aluno
                const studentClasses = await StudentClass.findAll({
                    where: { student_id: req.user.id },
                    attributes: ['classe_id'] // Pegamos apenas os IDs das classes
                });
            
                // Extraímos os IDs das classes em um array
                const classIds = studentClasses.map(sc => sc.classe_id);
            
                if (classIds.length === 0) {
                    return res.json([]); // Retorna um array vazio se o aluno não tiver classes
                }
            
                // Busca todas as atividades associadas às classes
                activities = await Activity.findAll({
                    where: { class_id: classIds } // Filtra pelo array de IDs
                });
            }
            

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

    async submit(req, res){
        try {
            const { activity_id } = req.validatedData;
            const files = req.files.map(file => file.path);
            const file_path = JSON.stringify(files);
            const user = req.user

            const activity = await ActivityDelivered.create({
                activity_id, file_path, student_id: user.id
            })

            return res.json({message: "Tarefa Enviada", activity});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async removeSubmit(req, res){
        try {
            const user = req.user;
            let activity =  await ActivityDelivered.findOne({
                where: {
                    student_id: user.id
                }
            })

            if(!activity){
                return res.status(400).json({message: "Entrega não encontrada"});
            }

            activity.destroy();
            
            return res.json({message: "Entrega removida", activity});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }

    async find(req, res){
        try {
            let courses;
            if(req.user.user_type == "student"){
                 courses = await Activity.findOne({
                    where: { id: req.params.activity_id },
                    include: [
                        {
                            model: ActivityDelivered,
                            as: 'activities_delivered',
                            attributes: ['file_path'],
                            include: [
                                {
                                    model: Student,
                                    as: 'student',
                                    attributes: ['id', 'name'],
                                    where: {
                                        id: req.user.id // Filtro para pegar apenas as entregas do aluno específico
                                    }
                                }
                            ]
                        }
                    ]
                });
            }else{
                courses = await Activity.findOne({
                    where: { id: req.params.activity_id },
                    include: [
                        {
                            model: ActivityDelivered,
                            as: 'activities_delivered',
                            attributes: ['file_path'],
                            include: [
                                {
                                    model: Student,
                                    as: 'student',
                                    attributes: ['id', 'name'],
                                }
                            ]
                        }
                    ]
                });
            }

            return res.json(courses);
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
    
    async update(req, res) {
        try {
            const { activity_id } = req.params;
            const { name, description, date, time, maximum_grade, teacher_id, class_id } = req.validatedData;
            const newFiles = req.files.map(file => file.path);
            
            // Buscar o activity no banco
            const activity = await Activity.findByPk(activity_id);

            // Verificar se o activity existe
            if (!activity)
                return res.status(404).json({ error: 'Tarefa não encontrada' });


            // Concatenar arquivos existentes com novos arquivos
            const existingFiles = JSON.parse(activity.file_path || '[]');
            const updatedFiles = [...existingFiles, ...newFiles];
            
            await activity.update({
                name, description, date, time, maximum_grade, teacher_id, class_id, file_path: JSON.stringify(updatedFiles)
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

    async removeFile(req, res){
        try {
            const { activity_id } = req.params;
            const { file_name } = req.params;
        
            // Buscar a atividade no banco
            const activity = await Activity.findByPk(activity_id);
        
            if (!activity) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }
        
            // Filtrar os arquivos para remover o especificado
            const existingFiles = JSON.parse(activity.file_path || '[]');
            const updatedFiles = existingFiles.filter(file => file !== file_name);
        
            // Atualizar os arquivos no banco
            await activity.update({
                file_path: JSON.stringify(updatedFiles)
            });
        
            // Remover o arquivo do sistema de arquivos
            const fs = require('fs');
            if (fs.existsSync(file_name)) {
                fs.unlinkSync(file_name);
            }
        
            return res.json({ message: 'Arquivo removido com sucesso', updatedFiles });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
        
    }

    async downloadFilesStudent(req, res){
        try {
            const activityId = req.params.activity_id;
            const studentId = req.params.student_id;
    
            // Buscar arquivos relacionados no banco de dados
            const activity = await ActivityDelivered.findOne({
                as: 'activities_delivered',
                attributes: ['file_path'],
                where: { activity_id: activityId },
            });

            const student = await Student.findByPk(studentId)
    
            if (!activity || activity.length === 0) {
                return res.status(404).json({ error: 'Nenhum arquivo encontrado para esta atividade e aluno.' });
            }
    
            
            // return res.status(404).json({ activity: activity.file_path });
            const files = JSON.parse(activity.file_path)
            
            // Nome do arquivo ZIP
            const nameFile = "Tarefa de " + student?.name + " - " + activityId
            const zipFileName = `${nameFile}.zip`;
            const outputPath = path.join(__dirname, zipFileName);
    
            // Criação do arquivo ZIP
            const output = fs.createWriteStream(outputPath);
            const archive = archiver('zip', { zlib: { level: 9 } });
    
            output.on('close', () => {
                res.download(outputPath, zipFileName, () => {
                    fs.unlinkSync(outputPath); // Exclui o arquivo ZIP após o download
                });
            });
    
            archive.on('error', (err) => {
                throw err;
            });
    
            archive.pipe(output);
    
            // Adiciona os arquivos ao ZIP
            files.forEach((file) => {
                const fileName = path.basename(file); // Extrai o nome do arquivo
                archive.file(file, { name: fileName });
            });
    
            await archive.finalize();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports =  new ActivityController();