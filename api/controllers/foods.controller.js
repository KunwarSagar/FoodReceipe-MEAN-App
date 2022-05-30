const Food = require("mongoose").model(process.env.FOOD_MODEL);

const getAll = function(req, res){
    const count = parseInt(process.env.COUNT, process.env.RADIX);
    const offset = parseInt(process.env.OFFSET, process.env.RADIX);

    if(req.query && req.query.count){
        count = parseInt(req.query.count, process.env.RADIX);
    }

    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, process.env.RADIX);
    }

    Food.find().skip(offset).limit(count).exec(function(err, games){
        const response = {status:200, message:games};
        
        if(err){
            console.log("Error", err);
            response.status = 500;
            response.message = {message:"Internal server error."}
        }else if(!games){
            console.log("Games not found");
            response.status = 404;
            response.message = {message:"Games not found"}
        }

        res.status(response.status).json(response.message);
    });
}

const getOne = function(req, res){
    const foodId = req.params.foodId;
    Food.findById(foodId).exec(function(err, food){
        const response = {status:200, message:food};

        if(err){
            console.log("Error", err);
            response.status = 500;
            response.message = {message:"Internal server error"};
        }else if(!food){
            console.log("Food not found");
            response.status = 404;
            response.message = {message:"Food not found"}
        }

        res.status(response.status).json(food);
    })
}

const addOne = function(req, res){
    const food = {
        name: req.body.name,
        origin:req.body.origin,
        ingredients:req.body.ingredients
    };

    Food.create(food, function(err, food){
        const response = {status:201, message:food};
        if(err){
            console.log("Error", err);
            response.message = {message:err};
            response.status = 500;
        }

        res.status(response.status).json(response.message);
    });
}

const _updateOne = function(req, res, foodUpdate){
    const foodId = req.params.foodId;
    Food.findById(foodId).exec(function(err, food){
        const response = {status: 204, message:food};
        if(err){
            response.status = 500;
            response.message = {message: "Internal server error."};
        }else if(!food){
            response.status = 404;
            response.message = {message:"Food not found."};
        }
        if(response.status != 204){
            res.status(response.status).json(response.message);
        }
        foodUpdate(req, res, food, response);
    });
}

const updateOne = function(req, res){

    const foodUpdate = function(req, res, food, response){
        food.name = req.body.name ? req.body.name : food.name;
        food.origin = req.body.origin ? req.body.origin : food.origin;
        // food.ingredients = req.body.ingredients ? req.body.ingredients : food.ingredients;
        
        food.save(function(err, updatedFood){
            if(err){
                console.log("Error", err);
                response.status = 500;
                response.message = {message :"Internal server error"};
            }else{
                response.status = 202;
                response.message = updatedFood;
            }

            res.status(response.status).json(response.message);
        });
    }

    _updateOne(req, res, foodUpdate)
}

const deleteone = function(req, res){
    const foodId = req.params.foodId;

    Food.findByIdAndDelete(foodId).exec(function(err, deletedFood){
        const response = {status: 204, message: deletedFood};
        if(err){
            console.log("Error finding food.");
            response.status = 500;
            response.message = err;
        }else if(!deletedFood){
            console.log("Food id not found");
            response.status = 404;
            response.message = {message:"Food not found"};
        }
        res.status(response.status).json(response.message);
    })
}

module.exports = {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteone
}