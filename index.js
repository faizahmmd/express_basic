const { response } = require("express");
let express = require("express");
let app = express();
app.listen(3000);
var bodyParser = require('body-parser');

app.use(function(req, res, next){
    console.log("hit on middleware");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/get", function(request, response){
    response.send({ get: true });
});

app.post("/post", function(req, res){
    //res.sendStatus(404);
    res.send({ post: true , name: req.body.name, age: req.body.age, place: req.body.Place});
});

app.get("/testquery", function(req, res){
    res.send({
        testquery: true,
        query1: req.query.name,
        query2: req.query.age
    });
});

app.get("/testparameter/:id/:phone", function(req, res){
res.send({
    testparameter: true,
    testparameter1: req.params.id,
    testparameter2: req.params.phone
});
});