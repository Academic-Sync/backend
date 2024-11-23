const { Model, DataTypes } = require('sequelize')
const StudentClass = require('./StudentClass')

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
        this.belongsToMany(models.Student, { through: StudentClass, foreignKey: 'classe_id', otherKey: 'student_id', as: 'students'})
        this.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course'})
        this.hasMany(models.Activity, {foreignKey: 'class_id', as: 'activities'})

        // Class.belongsToMany(Student, { through: StudentClass, foreignKey: 'class_id' });
    }
}

module.exports = Class;