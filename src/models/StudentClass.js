const { Model, DataTypes } = require('sequelize')

class StudentClass extends Model {
    static init(connection){
        super.init({
            classe_id: {
                type: DataTypes.INTEGER,
                allowNull: false, // Adiciona a restrição de NOT NULL
                references: {
                    model: 'classes',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },

            student_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'students', // Nome da tabela de estudantes
                    key: 'id',
                },
                onDelete: 'CASCADE', // Comportamento ao deletar um estudante
            },   
            created_at: DataTypes.INTEGER,
            updated_at: DataTypes.INTEGER,
        }, {
            sequelize: connection,
            modelName: 'StudentClass',
            tableName: 'student_classes', // Nome da tabela pivot
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }, // campos a serem excluídos
            },
        })
    }
}

module.exports = StudentClass;
