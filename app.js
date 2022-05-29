require("dotenv").config();
require("./api/data/dbconnect");

const express = require("express");
const router = require("./api/routes");
const app = express();

app.use(express.urlencoded({extended:true}));
app.use('/api', router);

// requires for css and styesheet
// app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(process.env.PORT, function(){
    console.log("Listening on http://localhost:"+server.address().port);
});