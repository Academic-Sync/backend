const express = require('express');
const ClassController = require('../controllers/ClassController');
const classValidator = require('../middlewares/classValidator');
const router = express.Router();

router.get('/', ClassController.index);
router.post('/', classValidator, ClassController.store);
router.get('/:course_id', ClassController.find);
router.delete('/:class_id', ClassController.delete);
router.put('/:class_id', classValidator, ClassController.update);

module.exports = router;