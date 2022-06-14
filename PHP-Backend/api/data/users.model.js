const mongoose = require("mongoose");

const usersSchema =  mongoose.Model({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

mongoose.model("User", usersSchema, "users");