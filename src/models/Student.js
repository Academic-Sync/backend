const User = require('./User')
const StudentClass = require('./StudentClass')

class Student extends User {
    static init(connection) {
        return super.init(connection);  // Chama o init da classe base (User)
    }

    static associate(models) {
        this.belongsToMany(models.Class, { through: StudentClass, as: 'classes', foreignKey: 'student_id', otherKey: 'classe_id' });
        this.hasMany(models.ActivityDelivered, { as: 'activities_delivered', foreignKey: 'student_id' });
    }
}

module.exports = Student;
