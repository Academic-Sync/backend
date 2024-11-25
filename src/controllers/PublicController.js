const Student = require('../models/Student');
const Class = require('../models/Class');
const User = require('../models/User');
const Course = require('../models/Course');
const Activity = require('../models/Activity');

class PublicController {
    async dashboard(req, res){
        try {
            let usersCount = await User.count()
            let studentsCount = await User.count({
                where: { user_type: "student" }
            });
            let teachersCount = await User.count({
                where: { user_type: "teacher" }
            });
            let coordinatorsCount = await User.count({
                where: { user_type: "coordinator" }
            });
            let advisorsCount = await User.count({
                where: { user_type: "advisor" }
            });

            let coursesCount = await Course.count()
            let classesCount = await Class.count()
            let activitiesCount = await Activity.count()

            

            return res.json({
                usersCount, studentsCount, classesCount, coursesCount, activitiesCount, teachersCount, coordinatorsCount, advisorsCount
            });
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}

module.exports =  new PublicController();