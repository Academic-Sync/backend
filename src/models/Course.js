const { Model, DataTypes } = require('sequelize')

class Course extends Model {
    static init(connection){
        super.init({
            name: DataTypes.STRING,
            period: DataTypes.STRING,
            is_annual: DataTypes.BOOLEAN,
            type_work: DataTypes.STRING,
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
        this.belongsTo(models.User, { foreignKey: 'coordinator_id', as: 'coordinator'})
    }
}

module.exports = Course;