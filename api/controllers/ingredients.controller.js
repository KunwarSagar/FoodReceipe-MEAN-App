const Food = require("mongoose").model(process.env.FOOD_MODEL);

const getAll = function(req, res){
    const foodId = req.params.foodId;
    Food.findById(foodId).select("ingredients").exec(function(err, food){
        const response = {status: 200, message:food};
        if(err){
            console.log("Err finding food.");
            response.status = 500;
            response.message = {message:"Internal server error."}
        }else if(!food){
            console.log("Food not found.");
            response.status = 404;
            response.message = {message:"Food not found."}
        }
        res.status(response.status).json(response.message);
    }); 
}

const getOne = function(req, res){
    const foodId = req.params.foodId;
    const ingredientId = req.params.ingredientId;

    Food.findById(foodId).select("ingredients").exec(function(err, food){
        const response = {status:200, message:food.ingredients.id(ingredientId)};
        if(err){
            console.log("Error", err);
            response.status = 500;
            response.message = {message:"Internal server error"};
        }else if(!food){
            console.log("Food not found");
            response.status = 404;
            response.message = {message:"Food not found."};
        }
        res.status(response.status).json(response.message);
    });
}

const addOne = function(req, res){
    const foodId = req.params.foodId;

    Food.findById(foodId).select("ingredients").exec(function(err, food){
        const response = {status:200, message:food};

        if(err){
            response.message = {message:"Internal server error"};
            response.status = 500;
        }else if(!food){
            response.message = {message: "Food not found."};
            response.status = 404;
        }
        if(food){
            _addIngredient(req, res, food);
        }else{
            res.status(response.status).json(response.message);
        }
    });
}

const _addIngredient = function(req, res, food){
    food.ingredients = [...food.ingredients, ...req.body.ingredients];

    food.save(function(err, updatedFood){
        const response = {status: 201, message:updatedFood.ingredients}
        if(err){
            response.status = 500;
            response.message = {message : "Internal server error."}
        }
        res.status(response.status).json(response.message);
    });
}

const updateOne = function(req, res){
    const update = function(req, res, food, response){
        const ingredientId = req.params.ingredientId;

        let ing = response.message.id(ingredientId);
            ing = req.body.ingredients[0];
        
        food.save(function(err, updatedFood){
            const response = {status: 201, message:updatedFood.ingredients.id(ingredientId)}
            if(err){
                response.status = 500;
                response.message = {message : "Internal server error."}
            }
            res.status(response.status).json(response.message);
        });
    }
    _updateIngredient(req, res, update);
}

const _updateIngredient = function(req, res, update){
    const foodId = req.params.foodId;

    Food.findById(foodId).select("ingredients").exec(function(err, food){
        const response = {status : 204, message:food.ingredients};
        if(err){
            console.log("Error", err);
            response.status = 500;
            response.message = {message:"Internal server error"};
        }else if(!food){
            console.log("Food not found");
            response.status = 404;
            response.message = {message:"Food not found"};
        }
        
        if(response.status != 204){
            res.status(response.status).json(response.message);
        }
        update(req, res, food, response);
    });

}

const deleteOne = function(req, res){
    const foodId = req.params.foodId;

    Food.findById(foodId).exec(function(err, food){
        const response ={status: 204, message:[]};
        if(err){
            response.message = {message:"Internal server error"};
            response.status = 500;
        }else if(!food){
            response.status = 404;
            response.message = {message:"Food not found."};
        }
        if(response.status != 204){
            res.status(response.status).json(response.message);
        }
        _deleteOne(req, res, food);
    });
}
const _deleteOne = function(req, res, food){
    const ingredientId = req.params.ingredientId;
    food.ingredients.id(ingredientId).remove();
    food.save(function(err, updatedFood){
        const response = {status: 201, message:"Deleted"}
        if(err){
            response.status = 500;
            response.message = {message : "Internal server error."}
        }
        res.status(response.status).json(response.message);
    });
}

module.exports = {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteOne
}