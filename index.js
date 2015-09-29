// index.js for login!

// http://blog.modulus.io/mongodb-tutorial
// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters

// body-parser object for getting post params
// https://www.npmjs.com/package/body-parser

// require modules
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var path = require('path');
var mongodb = require('mongodb');



// serve static files in public path 
var publicPath = path.join(__dirname, "public");

// middleware
app.use(express.static(publicPath));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var port = process.env.PORT || 3000; // for deploying to heroku
var server; // global variable for server
var url = 'mongodb://localhost:27017/data'; // connection url
var db; // global variable for database
var MongoClient = mongodb.MongoClient; // mongoclient connects to mongodb server



// Initialize connection once
MongoClient.connect(url, function(err, database) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url); // HURRAY!! We are connected. :)


    // if(err) throw err;

    db = database;

    // Start the application after the database connection is ready
    server = app.listen(port, function() {
      console.log("listening on *:" + port);
    });
  }
});



// routing
// redirect to login page
app.get('/', function(req, res) { 
  res.sendFile(publicPath + '/login.html');
});

// post from login page
app.post('/?*', function(req, res) { 
  console.log("login query sent!");
  var nm = req.body.name;
  var un = req.body.username;
  var pw = req.body.password;
  var em = req.body.email;

  // db.collection("users").find({}, function(err, docs) {
  //   docs.each(function(err, doc) {
  //     if(doc) {
  //       console.log(doc);
  //     }
  //   });
  // });

  console.log('username: ' + un + " password: " + pw);
  res.send(publicPath + '/login.html');
});



// post from account settings page
app.post('/accountSettings.html?*', function(req, res) { 
  var nm = req.body.name;
  var un = req.body.username;
  var pw = req.body.password;
  var em = req.body.email;
  console.log('name: ' + nm + ' username: ' + un + ' password: ' + pw + ' email: ' + em);
  res.send(publicPath + '/login.html');
});

// post from create account page
app.post('/createAccount.html?*', function(req, res) { 
  var nm = req.body.name;
  var un = req.body.username;
  var pw = req.body.password;
  var em = req.body.email;
  console.log('name: ' + nm + ' username: ' + un + ' password: ' + pw + ' email: ' + em);
  res.send(publicPath + '/login.html');
});

// post from forgotPassword page
app.post('/forgotPassword.html?*', function(req, res) { 
  var em = req.body.email;
  console.log('email: ' + em);
  res.send(publicPath + '/login.html');
});






