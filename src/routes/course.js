const express = require('express');
const CourseController = require('../controllers/CourseController');
const courseValidator = require('../middlewares/courseValidator');
const router = express.Router();

router.get('/', CourseController.index);
router.post('/', courseValidator, CourseController.store);
router.get('/:course_id', CourseController.find);
router.delete('/:course_id', CourseController.delete);
router.put('/:course_id', courseValidator, CourseController.update);

module.exports = router;