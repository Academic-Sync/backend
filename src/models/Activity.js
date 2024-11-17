const { Model, DataTypes } = require("sequelize");

class Activity extends Model{
    static init(connection){
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            date: DataTypes.DATEONLY,
            time: DataTypes.TIME,
            maximum_grade: DataTypes.FLOAT
        })
    }
}