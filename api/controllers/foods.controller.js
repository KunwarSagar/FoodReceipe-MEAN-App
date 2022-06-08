const Food = require("mongoose").model(process.env.FOOD_MODEL);

const getAll = function (req, res) {
    let count = parseInt(process.env.COUNT, process.env.RADIX);
    let offset = parseInt(process.env.OFFSET, process.env.RADIX);
    let maxCount = parseInt(process.env.MAX_COUNT, process.env.RADIX);

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, process.env.RADIX);
    }

    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, process.env.RADIX);
    }

    const response = { status: 204, message: {} };

    if (isNaN(offset) || isNaN(count)) {
        response.status = 400;
        response.message = { message: "QueryString Offset and Count should be numbers" };
    }

    if (count > maxCount) {
        response.status = 400;
        response.message = { message: "Max count Cannot exceed " + maxCount }
    }

    if (response.status != 204) {
        res.status(response.status).json(response.message);
        return;
    }

    Food
        .find()
        .skip(offset)
        .limit(count)
        .exec()
        .then(foods => {
            if (!foods) {
                response.status = 404;
                response.message = { message: "Food not found" }
            } else {
                response.status = 200;
                response.message = foods;
            }
        })
        .catch(err => {
            response.status = 500;
            response.message = { message: "Something went wrong." }
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        });
}

const getOne = function (req, res) {
    const foodId = req.params.foodId;

    const response = { status: 204, message: {} };
    Food
        .findById(foodId)
        .exec()
        .then(food => {
            if (!food) {
                console.log("Food not found");
                response.status = 404;
                response.message = { message: "Food not found" }
            } else {
                response.status = 200;
                response.message = food;
            }
        })
        .catch(err => {
            response.status = 500;
            response.message = { message: "Something went wrong." };
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        });
}

const addOne = function (req, res) {
    const food = {
        name: req.body.name,
        origin: req.body.origin,
        description: req.body.description,
        ingredients: req.body.ingredients
    };

    const response = { status: 204, message: {} };
    Food
        .create(food)
        .then(addedFood => {
            response.status = 201;
            response.message = food;
        })
        .catch(err => {
            response.status = 500;
            response.message = { message: "Insert failed." }
        })
        .finally(() => {
            res.status(response.status).json(response.message);
        });
}

const _update = function (req, res, _updateFood) {
    const foodId = req.params.foodId;
    const response = { status: 204, message: {} };
    Food
        .findById(foodId)
        .exec()
        .then(food => {
            if (food) {
                response.status = 204;
                response.message = food;
            } else {
                response.status = 404;
                response.message = { message: "Food not found." };
            }
        })
        .catch(err => {
            response.status = 500;
            response.message = { message: "Update failed." };
        })
        .finally(() => {
            if (response.status != 204) {
                res.status(response.status).json(response.message);
            }
            _updateFood(req, res, response.message);
        });

    ;
}

const partialUpdateFood = function (req, res) {
    _update(req, res, _partialUpdateFood)
}

const _partialUpdateFood = function (req, res, food) {

    food.name = req.body.name ? req.body.name : food.name;
    food.origin = req.body.origin ? req.body.origin : food.origin;
    food.description = req.body.description ? req.body.description : food.description;

    _saveAndReturn(food, res);
}

const fullUpdateFood = function (req, res) {
    _update(req, res, _fullUpdateFood)
}


const _fullUpdateFood = function (req, res, food) {
    food.name = req.body.name;
    food.origin = req.body.origin;
    food.description = req.body.description;

    _saveAndReturn(food, res);
}

const _saveAndReturn = function (food, res) {
    const response = { status: 204, message: {} };
    food.save()
        .then(updatedFood=>{
            response.status = 202;
            response.message = updatedFood;
        })
        .catch(err=>{
            response.status = 500;
            response.message = { message: "Update failed." };
        })
        .finally(()=>{
            res.status(response.status).json(response.message);
        });
}

const deleteone = function (req, res) {
    const foodId = req.params.foodId;

    const response = { status: 204, message: {} };
    Food.findByIdAndDelete(foodId).exec()
        .then(deletedFood => {
            response.status = 204;
            response.message = deletedFood;
        }).catch(error => {
            response.status = 500;
            response.message = { message: "Delete failed." };
        }).finally(() => {
            res.status(response.status).json(response.message);
        });
}

module.exports = {
    getAll,
    getOne,
    addOne,
    partialUpdateFood,
    fullUpdateFood,
    deleteone
}