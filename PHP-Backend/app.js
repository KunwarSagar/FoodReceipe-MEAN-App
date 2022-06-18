require("dotenv").config();
require("./api/data/dbconnect");

const express = require("express");
const router = require("./api/routes");
const path = require("path");
const app = express();

const {storage, multer} = require("./_multer");
const uploads = multer({storage:storage});

app.use(process.env.API_PREFIX, function(req, res, next){
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
    res.header('Access-Control-Allow-Headers', process.env.ALLOWED_HEADERS);
    res.header("Access-Control-Allow-Methods", process.env.ALLOWED_METHODS);
    next();
});

app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(uploads.single(process.env.THUMBNAIL_IMAGE_KEY));

app.use(process.env.STATIC_ASSET_ROUTE, express.static(path.join(__dirname, process.env.PUBLIC_DIRECTORY_NAME)));
app.use(process.env.API_PREFIX, router);


const server = app.listen(process.env.PORT, function(){
    console.log("Listening on http://localhost:"+server.address().port);
});