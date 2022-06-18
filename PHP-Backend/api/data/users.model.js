const mongoose = require("mongoose");

const usersSchema =  mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    username : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    }
});

mongoose.model(process.env.USER_MODEL, usersSchema, process.env.DB_USER_COLLECTION);