"use strict";

const path = require("path"),
  cors = require("cors"),
  morgan = require("morgan"),
  express = require("express"),
  bodyParser = require("body-parser"),
  fileUpload = require("express-fileupload");
  

global._session = require("express-session");
global.__rootRequire = function (relpath) {

  return require(path.join(__dirname, relpath));

};

// process.env.NODE_ENV = process.env.NODE_ENV || "prod"; //local server

require('dotenv').config()

const app = express();

app.use(cors({
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
}));

app.use(fileUpload());

app.use(bodyParser.json());

app.use(express.json({ limit: "10kb" }));

app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static('dist'))


app.use("/upload", express.static(path.join(__dirname, "./upload")));


app.use(function (req, res, next) {



  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain

  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");

  res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization,multipart/form-data");


  if (req.method == "OPTIONS") {

    res.status(200).end();

  } else {

    next();

  }

});

app.use(

  _session({

    secret: "something crazy",

    resave: false,

    saveUninitialized: true,

    cookie: { secure: false },

  })

);


require("./app/config/db");

// Including routes

app.use("/api/v1", require("./app/api/v1/routes")(express));

// Starting Server

const port = process.env.PORT || 5000;


app.listen(port,()=>{
   console.log('Server running on port',port);
})