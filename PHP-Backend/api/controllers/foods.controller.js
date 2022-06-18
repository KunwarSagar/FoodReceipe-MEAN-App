const Food = require("mongoose").model(process.env.FOOD_MODEL);

const getSize = function (req, res) {
    const response = { status: process.env.DEFAULT_CODE, message: {} };
    Food.count()
        .then(size => _fileResponse(process.env.GET_SUCCESS_CODE, { size }, response, process.env.FOOD_COUNT_FIND_ERROR))
        .catch(err => _fileResponse(process.env.ERROR_CODE, err, response, process.env.INTERNAL_ERROR_MESSAGE))
        .finally(() => _sendResponse(res, response));
}

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

    let page = 1;

    if (req.query && req.query.page) {
        page = parseInt(req.query.page, process.env.RADIX);
        if (page > 1) {
            offset = count * (page - 1);
        }
    }

    // search by food
    let searchValue = "";
    if (req.query && req.query.searchString) {
        searchValue = req.query.searchString;
    }
    let query = searchValue ? { name: { $regex: '.*' + searchValue + '.*', $options: 'i' } } : null;

    const response = { status: process.env.DEFAULT_CODE, message: {} };

    if (isNaN(offset) || isNaN(count)) {
        response.status = process.env.IS_FALSY;
        response.message = { message: process.env.OFFSET_COUNT_SHOULD_BE_NUM };
    }

    if (count > maxCount) {
        response.status = process.env.IS_FALSY;
        response.message = { message: process.env.MAX_COUNT_EXCCED_MESSAGE + maxCount }
    }

    if (response.status != process.env.DEFAULT_CODE) {
        _sendResponse(res, response);
        return;
    }

    Food
        .find(query)
        .skip(offset)
        .limit(count)
        .sort({ _id: -1 })
        .exec()
        .then(foods => _fileResponse(process.env.GET_SUCCESS_CODE, foods, response, process.env.NOT_FOUND, true))
        .catch(err => _fileResponse(process.env.ERROR_CODE, err, response, process.env.INTERNAL_ERROR_MESSAGE))
        .finally(() => _sendResponse(res, response));
}

const getOne = function (req, res) {
    const foodId = req.params.foodId;

    const response = { status: process.env.DEFAULT_CODE, message: {} };
    Food
        .findById(foodId)
        .exec()
        .then(food => _fileResponse(process.env.GET_SUCCESS_CODE, food, response, process.env.NOT_FOUND, true))
        .catch(err => _fileResponse(process.env.ERROR_CODE, err, response, process.env.INTERNAL_ERROR_MESSAGE))
        .finally(() => _sendResponse(res, response));
}

const addOne = function (req, res) {
    const food = {
        name: req.body.name,
        origin: req.body.origin,
        description: req.body.description,
        ingredients: JSON.parse(req.body.ingredients),
        imageUrl: req.file.path
    };

    const response = { status: process.env.DEFAULT_CODE, message: {} };
    Food
        .create(food)
        .then(addedFood => _fileResponse(process.env.ADD_SUCCESS_CODE, addedFood, response, process.env.FOOD_ADD_FAILED))
        .catch(err => _fileResponse(process.env.ERROR_CODE, err, response, process.env.FOOD_ADD_FAILED))
        .finally(() => _sendResponse(res, response));
}

_foodFoundCallback = function (food, response) {
    if (food) {
        response.message = food;
    } else {
        response.status = process.env.NOT_FOUND_CODE;
        response.message = { message: process.env.NOT_FOUND };
    }
}

_updateOrReturn = function (req, res, response) {
    if (response.status != process.env.DEFAULT_CODE) {
        _sendResponse(res, response);
    }
    _updateFood(req, res, response.message);
}


_update = function (req, res, _updateFood) {
    const foodId = req.params.foodId;
    const response = { status: process.env.DEFAULT_CODE, message: {} };
    Food
        .findById(foodId)
        .exec()
        .then(food => _foodFoundCallback(food, response))
        .catch(err => _fileResponse(process.env.ERROR_CODE, err, response, process.env.UPDATE_FAILED))
        .finally(() => _updateOrReturn(req, res, response));

    ;
}

//we are not doing partial update for now
const partialUpdateFood = function (req, res) {
    _update(req, res, _partialUpdateFood)
}

_partialUpdateFood = function (req, res, food) {

    food.name = req.body.name ? req.body.name : food.name;
    food.origin = req.body.origin ? req.body.origin : food.origin;
    food.description = req.body.description ? req.body.description : food.description;
    food.imageUrl = req.body.imageUrl ? req.body.imageUrl : food.imageUrl;

    _saveAndReturn(food, res);
}

const fullUpdateFood = function (req, res) {
    _update(req, res, _fullUpdateFood)
}

_fullUpdateFood = function (req, res, food) {
    food.name = req.body.name;
    food.origin = req.body.origin;
    food.description = req.body.description;
    food.imageUrl = req.body.imageUrl ? req.body.imageUrl : req.file.path;
    food.ingredients = JSON.parse(req.body.ingredients);

    _saveAndReturn(food, res);
}

_saveAndReturn = function (food, res) {
    const response = { status: process.env.DEFAULT_CODE, message: {} };
    food.save()
        .then(updatedFood => _fileResponse(process.env.UPDATE_SUCCESS_CODE, updatedFood, response, process.env.UPDATE_FAILED))
        .catch(err => _fileResponse(process.env.ERROR_CODE, err, response, process.env.UPDATE_FAILED))
        .finally(() => _sendResponse(res, response));
}

const deleteone = function (req, res) {
    const foodId = req.params.foodId;

    const response = { status: process.env.DEFAULT_CODE, message: {} };
    Food.findByIdAndDelete(foodId).exec()
        .then(deletedFood => _fileResponse(process.env.DELETE_SUCCESS_CODE, deletedFood, response, process.env.DELETE_FAILED))
        .catch(error => _fileResponse(process.env.ERROR_CODE, error, response, process.env.DELETE_FAILED))
        .finally(() => _sendResponse(res, response));
}

_fileResponse = function (status, data, response, message, isGet = false) {
    if (status == process.env.ERROR_CODE) {
        response.status = process.env.ERROR_CODE;
        response.message = { message: message };
    } else {
        if (data) {
            response.status = status;
            response.message = data;
        } else {
            if (isGet) {
                response.status = process.env.NOT_FOUND_CODE;
            } else {
                response.status = process.env.IS_NOT_VALID_CODE;
            }
            response.message = { message: message };
        }
    }
}

_sendResponse = function (res, response) {
    res.status(parseInt(response.status, process.env.RADIX)).json(response.message);
}

module.exports = {
    getSize,
    getAll,
    getOne,
    addOne,
    partialUpdateFood,
    fullUpdateFood,
    deleteone
}