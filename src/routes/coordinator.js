const express = require('express');
const CoordinatorController = require('../controllers/CoordinatorController');
const userValidator = require('../middlewares/userValidator');
const router = express.Router();

router.get('/', CoordinatorController.index);
router.post('/', userValidator, CoordinatorController.store);
router.get('/:user_id', CoordinatorController.find);
router.delete('/:user_id', CoordinatorController.delete);
router.put('/:user_id', userValidator, CoordinatorController.update);

module.exports = router;