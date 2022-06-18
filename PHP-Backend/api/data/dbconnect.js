const mongoose = require("mongoose");
require("./foods.model");
require("./users.model")

mongoose.connect(process.env.DB_URL, {useNewUrlParser : true, useUnifiedTopology: true});

mongoose.connection.on("connected", function(){
    console.log(process.env.CONNECTED_MESSAGE, process.env.DB_NAME);
});

mongoose.connection.on("disconnected", function(){
    console.log(process.env.DISCONNECTED_MESSAGE);
});

mongoose.connection.on("error", function(error){
    console.log(process.env.DB_CONNECTION_ERROR, error);
});

process.on("SIGINT", function(){
    mongoose.connection.close(function(){
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});

process.once("SIGUSR2", function(){
    mongoose.connection.close(function(){
        console.log(process.env.SIGUSR2_MESSAGE);
        process.kill(process.pid, "SIGUSR2");
    });
});
