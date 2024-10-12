const express = require('express');
const StudentController = require('../controllers/StudentController');
const studentValidator = require('../middlewares/studentValidator');
const uploadFile = require('../middlewares/uploadFile');
const router = express.Router();

router.get('/', StudentController.index);
router.post('/', studentValidator, StudentController.store);
router.post('/store-by-file', uploadFile.single('file'), StudentController.storeByFile);
router.delete('/:user_id', StudentController.delete);
router.put('/:user_id', studentValidator, StudentController.update);

module.exports = router;