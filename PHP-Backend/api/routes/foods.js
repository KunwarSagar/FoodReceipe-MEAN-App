const router = require("express").Router();
const foodController = require("../controllers/foods.controller");
const authController = require("../controllers/auth.controller");

router.route('')
    .get(foodController.getAll)
    .post(authController.authenticate, foodController.addOne);

router.route('/size')
    .get(foodController.getSize);

router.route('/:foodId')
    .get(foodController.getOne)
    .put(authController.authenticate, foodController.fullUpdateFood)
    .patch(authController.authenticate, foodController.partialUpdateFood)
    .delete(authController.authenticate, foodController.deleteone);

module.exports = router;