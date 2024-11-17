const { Model, DataTypes } = require('sequelize')

class User extends Model {
   static init(connection) {
       super.init({
           name: DataTypes.STRING,
           email: DataTypes.STRING,
           password: DataTypes.STRING,
           user_type: DataTypes.STRING,
           code: DataTypes.STRING,
           created_at: DataTypes.INTEGER,
           updated_at: DataTypes.INTEGER,
       }, {
           sequelize: connection,
           tableName: 'users',
           defaultScope: {
            attributes: { exclude: ['createdAt', 'updatedAt'] }, // campos a serem excluídos
        },
       },);
   }

   static associate(models) {
       this.hasOne(models.Course, { foreignKey: 'coordinator_id', as: 'courses' });
       this.hasOne(models.Class, { foreignKey: 'teacher_id', as: 'teacher' });
   }
}

module.exports = User;
