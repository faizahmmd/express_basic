const { response } = require("express");
let express = require("express");
let app = express();
app.listen(3000);
var bodyParser = require('body-parser');
let mysql = require("mysql");
let jwt = require("jsonwebtoken");
 let connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        //If database is already created.
        database: "mydatabase"
    }
);
connection.connect(function(error){
if(error){
    throw error;
}
console.log("Connected to database");
//To create database using code.
//connection.query("create database mydatabase");

//For CRUD operations.
// connection.query("create table categories(id int primary key auto_increment, categories varchar(50))", function(error, result){
//     if(error){
//       throw (error);
//     }
//     console.log(result);
// });
// connection.query("INSERT INTO `categories`(`categories`) VALUES ('[indoor, out door]')", function(error, result){
//     if(error){
//         throw (error);
//       }
//       console.log(result);
// });
// connection.query("UPDATE `categories` SET `categories`='[indoor, out door]' WHERE id = 1", function(error, result){
//     if(error){
//         throw (error);
//       }
//       console.log(result);
// });
// connection.query("DELETE FROM `categories` WHERE id = 4", function(error, result){
//     if(error){
//         throw (error);
//       }
//       console.log(result);
// });
// connection.query("SELECT * FROM `categories` WHERE id = 1", function(error, result){
//     if(error){
//         throw (error);
//       }
//       console.log(result);
// });
// connection.query("SELECT `id`, `categories` FROM `categories` WHERE id = 2", function(error, result){
//     if(error){
//         throw (error);
//       }
//       console.log(result);
// });

//Relational dtabase examples, already created 2 tables students and marks.

// connection.query("SELECT * FROM `marks` join `students` on marks.student_id = students.id", function(error, result){
//     if(error){
//         throw (error);
//     }
//     console.log(result);
// });

//join & inner join both are same.
// connection.query("SELECT * FROM `marks` inner join `students` on marks.student_id = students.id", function(error, result){
//     if(error){
//         throw (error);
//     }
//     console.log(result);
// });

// connection.query("SELECT * FROM `marks` left join `students` on marks.student_id = students.id", function(error, result){
//     if(error){
//         throw (error);
//     }
//     console.log(result);
// });

// connection.query("SELECT * FROM `marks` right join `students` on marks.student_id = students.id", function(error, result){
//     if(error){
//         throw (error);
//     }
//     console.log(result);
// });

// connection.query("SELECT * FROM `marks` cross join `students`", function(error, result){
//     if(error){
//         throw (error);
//     }
//     console.log(result);
// });

});

//middlewares

app.use(function(req, res, next){
    console.log("hit on middleware");
    next(); 
});
let urlEncodedParser = app.use(bodyParser.urlencoded({ extended: false }));
let jsonParser = app.use(bodyParser.json());
function verifyToken(req, res, next){
    let auth = req.headers.authorization;
    console.log(auth);
    if(auth == undefined){
        res.status(404).send("require access token");
    }else{
        let token = auth.split(" ")[1];
        jwt.verify(token, "secretKey", function(error, decodedToken){
            if(error){
             res.status(404).send("invalid access token");
            }else{
                res.locals.token = token;
                next();
            }
        });
    }
}


app.get("/get",verifyToken, function(request, response){
    response.send({ get: true, accestoken: response.locals.token});
});

app.post("/post", jsonParser, function(req, res){
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

//jwt, authentication
app.post("/login", function(req, res){
    if(req.body.username == undefined || req.body.password == undefined){
        res.status(404).send({error: "please provide username or password"});
        return;
    }
    let username = req.body.username;
    let password = req.body.password;
    connection.query("SELECT `display_name` FROM `users` WHERE user_name = 'faizahmmd' AND password = 'password1'", function(error, result){
if(error || result.length == 0){
    response.status(404).send({error: "no user found"});
    return;
}
let dataToSend = {success: "login success", displayname: result[0].display_name};
let token = jwt.sign(dataToSend, "secretKey", {expiresIn: 6000000000});
res.status(200).send({accesstoken: token, data: dataToSend});
    });
});