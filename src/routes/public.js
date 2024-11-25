const express = require("express");
const router = express.Router();
const PublicController = require("../controllers/PublicController");

router.get('/dashboard', PublicController.dashboard);

module.exports = router;
