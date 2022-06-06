require("dotenv").config();
require("./api/data/dbconnect");

const express = require("express");
const router = require("./api/routes");
const app = express();


app.use("/api", function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
})
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use('/api', router);

// requires for css and styesheet
// app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(process.env.PORT, function(){
    console.log("Listening on http://localhost:"+server.address().port);
});