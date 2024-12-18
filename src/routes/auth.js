const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const auth = require("../middlewares/auth");

router.get('/', (req, res) => res.json("Hello World"));
router.post("/login", AuthController.login);
router.get("/profile", auth, AuthController.profile);
router.put("/profile", auth, AuthController.update);

module.exports = router;
