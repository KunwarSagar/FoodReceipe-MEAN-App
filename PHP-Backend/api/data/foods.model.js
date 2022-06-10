const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name : String,
    quantity : String
});

const foodSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    origin : {
        type : String,
        required : true
    },
    description : String,
    ingredients : [ingredientSchema],
    imageUrl: String
});

mongoose.model(process.env.FOOD_MODEL, foodSchema, process.env.DB_FOOD_COLLECTION);