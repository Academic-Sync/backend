const { Model, DataTypes } = require('sequelize')

class Class extends Model {
    static init(connection){
        super.init({
            semester: DataTypes.INTEGER,
            created_at: DataTypes.INTEGER,
            updated_at: DataTypes.INTEGER,
        }, {
            sequelize: connection,
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }, // campos a serem excluídos
            },
        })
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher'})
        this.belongsToMany(models.Student, { through: 'student_posts', foreignKey: 'student_id', as: 'students'})
        this.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course'})

        // Class.belongsToMany(Student, { through: StudentClass, foreignKey: 'class_id' });
    }
}

module.exports = Class;