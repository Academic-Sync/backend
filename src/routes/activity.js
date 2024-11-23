const express = require('express');
const ActivityController = require('../controllers/ActivityController');
const activityValidator = require('../middlewares/activityValidator');
const router = express.Router();
const upload = require('../middlewares/uploadFileActivity');

router.get('/', ActivityController.index);
router.post('/', upload.array('files[]', 10), activityValidator, ActivityController.store);
router.get('/:activity_id', ActivityController.find);
router.delete('/:activity_id', ActivityController.delete);
router.put('/:activity_id', upload.array('files[]', 10), activityValidator, ActivityController.update);


module.exports = router;