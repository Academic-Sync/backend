const { Model, DataTypes } = require("sequelize");

class Activity extends Model{
    static init(connection){
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            date: DataTypes.DATEONLY,
            time: DataTypes.TIME,
            maximum_grade: DataTypes.FLOAT,
            file_path: DataTypes.STRING
        }, {
            sequelize: connection,
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }, // campos a serem excluídos
            },
        })
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher'})
        this.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class'})
    }
}

module.exports = Activity;