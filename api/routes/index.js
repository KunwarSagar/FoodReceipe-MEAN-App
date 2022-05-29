const router = require("express").Router();
const foodController = require("../controllers/foods.controller")
router.route('/foods')
    .get(foodController.getAll)
    .post(foodController.addOne);

router.route('/foods/:foodId')
    .get(foodController.getOne)
    .put(foodController.updateOne)
    .delete(foodController.deleteone);

module.exports = router;