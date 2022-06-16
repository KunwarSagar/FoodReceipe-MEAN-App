const router = require("express").Router();
const userController = require("../controllers/users.controller");

router.route('')
    .post(userController.register)   
    .put(userController.login);

module.exports = router;