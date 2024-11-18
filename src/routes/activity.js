const express = require('express');
const ActivityController = require('../controllers/ActivityController');
const activityValidator = require('../middlewares/activityValidator');
const router = express.Router();

router.get('/', ActivityController.index);
router.post('/', activityValidator, ActivityController.store);
router.get('/:activity_id', ActivityController.find);
router.delete('/:activity_id', ActivityController.delete);
router.put('/:activity_id', activityValidator, ActivityController.update);

module.exports = router;