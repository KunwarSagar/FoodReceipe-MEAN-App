require("dotenv").config();
require("./api/data/dbconnect");

const express = require("express");
const router = require("./api/routes");
const path = require("path");
const app = express();

const {storage, multer} = require("./_multer");
const uploads = multer({storage:storage});
app.use(function(req, res, next){
    console.log(req.url);
    next();
});

app.use("/api", function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use(express.urlencoded({extended:true}));
app.use(express.json()) //10 mb
app.use(uploads.single('thumbnailImage'));

app.use("/api/public", express.static(path.join(__dirname, "public")));
app.use('/api', router);


const server = app.listen(process.env.PORT, function(){
    console.log("Listening on http://localhost:"+server.address().port);
});