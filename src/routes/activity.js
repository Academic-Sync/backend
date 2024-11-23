const express = require('express');
const ActivityController = require('../controllers/ActivityController');
const activityValidator = require('../middlewares/activityValidator');
const router = express.Router();
const upload = require('../middlewares/uploadFileActivity');
const removeFileActivity = require("../middlewares/removeFileActivity")


router.get('/', ActivityController.index);
router.post('/', upload.array('files[]', 10), activityValidator, ActivityController.store);
router.delete('/:activity_id', ActivityController.delete);
router.delete('/file/:activity_id', function(req, res){
    return res.send("aasasas")
});
router.put('/:activity_id', upload.array('files[]', 10), activityValidator, ActivityController.update);
router.get('/:activity_id', ActivityController.find);


module.exports = router;