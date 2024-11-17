const { Model, DataTypes } = require('sequelize')

class StudentClass extends Model {
    static init(connection){
        super.init({
            student_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'students', // Nome da tabela de estudantes
                    key: 'id',
                },
                onDelete: 'CASCADE', // Comportamento ao deletar um estudante
            },
            class_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'classes', // Nome da tabela de classes
                    key: 'id',
                },
                onDelete: 'CASCADE', // Comportamento ao deletar uma classe
            },
            created_at: DataTypes.INTEGER,
            updated_at: DataTypes.INTEGER,
        }, {
            sequelize: connection,
            modelName: 'StudentClass',
            tableName: 'student_classes', // Nome da tabela pivot
            timestamps: false, // Caso não precise de timestamps
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }, // campos a serem excluídos
            },
        })
    }
}

module.exports = StudentClass;
