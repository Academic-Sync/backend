const express = require('express');
const TeacherController = require('../controllers/TeacherController');
const userValidator = require('../middlewares/userValidator');
const router = express.Router();

router.get('/', TeacherController.index);
router.post('', userValidator, TeacherController.store);
router.get('/:user_id', TeacherController.find);
router.delete('/:user_id', TeacherController.delete);
router.put('/:user_id', userValidator, TeacherController.update);

module.exports = router;