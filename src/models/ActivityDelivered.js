const { Model, DataTypes } = require("sequelize");

class ActivityDelivered extends Model{
    static init(connection){
        super.init({
            student_id: DataTypes.STRING,
            activity_id: DataTypes.FLOAT,
            file_path: DataTypes.STRING
        }, {
            sequelize: connection,
            tableName: 'activities_delivered',
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }, // campos a serem excluídos
            },
        })
    }

    static associate(models){
        this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student'})
        this.belongsTo(models.Activity, { foreignKey: 'activity_id', as: 'class'})
    }
}

module.exports = ActivityDelivered;