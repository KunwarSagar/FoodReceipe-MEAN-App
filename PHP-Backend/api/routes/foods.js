const router = require("express").Router();
const foodController = require("../controllers/foods.controller");

router.route('')
    .get(foodController.getAll)
    .post(foodController.addOne);

router.route('/size')
    .get(foodController.getSize);

router.route('/:foodId')
    .get(foodController.getOne)
    .put(foodController.fullUpdateFood)
    .patch(foodController.partialUpdateFood)
    .delete(foodController.deleteone);

module.exports = router;