const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name : String,
    quantity : Number
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
    ingredients : [ingredientSchema]
});

mongoose.model(process.env.FOOD_MODEL, foodSchema, process.env.DB_FOOD_COLLECTION);