const router = require("express").Router();
const foodController = require("../controllers/foods.controller");
const ingredientController = require("./../controllers/ingredients.controller");

router.route('/foods')
    .get(foodController.getAll)
    .post(foodController.addOne);

router.route('/foods/size')
    .get(foodController.getSize);

// router.route('/foods/addThumbnail')
//     .post(foodController.addThumbnail);

router.route('/foods/:foodId')
    .get(foodController.getOne)
    .put(foodController.fullUpdateFood)
    .patch(foodController.partialUpdateFood)
    .delete(foodController.deleteone);

router.route('/foods/:foodId/ingredients')
    .get(ingredientController.getAll)
    .post(ingredientController.addOne);

router.route('/foods/:foodId/ingredients/:ingredientId')
    .get(ingredientController.getOne)
    .put(ingredientController.fullUpdateIngredient)
    .patch(ingredientController.partialUpdateIngredient)
    .delete(ingredientController.deleteOne);

module.exports = router;