const User = require('./User')

class Advisor extends User {
    static init(connection) {
        return super.init(connection);  // Chama o init da classe base (User)
    }
}

module.exports = Advisor;
