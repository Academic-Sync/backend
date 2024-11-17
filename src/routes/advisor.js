const express = require('express');
const Advisor = require('../controllers/AdvisorController');
const advisorValidator = require('../middlewares/advisorValidator');
const router = express.Router();

router.get('/', Advisor.index);
router.post('/', advisorValidator, Advisor.store);
router.get('/:user_id', Advisor.find);
router.delete('/:user_id', Advisor.delete);
router.put('/:user_id', advisorValidator, Advisor.update);

module.exports = router;