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

var currentUser = {};

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
app.post('/', function(req, res) { 
  var un = req.body.username;
  var pw = req.body.password;
  var sendPath = '';

  db.collection("users").findOne({"username": un}, function(err, doc) {
    if(doc) {
      if (doc.password === pw) {
        console.log("login successful!");
        sendPath = '/secrets.html';
        res.sendFile(publicPath + sendPath);
     } else {
        console.log("wrong password");
        sendPath = '/login.html';
        res.sendFile(publicPath + sendPath);
      }
    } else {
      console.log("username does not exist!");
      sendPath = '/login.html';
      res.sendFile(publicPath + sendPath);
   }
  });

  console.log('username: ' + un + " password: " + pw);
});


// this is to fix an error with the navigation
// where you go to login.html sometimes
// will fix later...
app.post('/login.html?*', function(req, res) { 
  var un = req.body.username;
  var pw = req.body.password;
  var sendPath = '';

  db.collection("users").findOne({"username": un}, function(err, doc) {
    if(doc) {
      if (doc.password === pw) {
        console.log("login successful!");
        sendPath = '/secrets.html';
        res.sendFile(publicPath + sendPath);
     } else {
        console.log("wrong password");
        sendPath = '/login.html';
        res.sendFile(publicPath + sendPath);
      }
    } else {
      console.log("username does not exist!");
      sendPath = '/login.html';
      res.sendFile(publicPath + sendPath);
   }
  });

  console.log('username: ' + un + " password: " + pw);
});



// post from account settings page
app.post('/accountSettings.html?*', function(req, res) { 
  var nm = req.body.name;
  var un = req.body.username;
  var pw = req.body.password;
  var em = req.body.email;
  console.log('name: ' + nm + ' username: ' + un + ' password: ' + pw + ' email: ' + em);
  db.collection("users").save({"name":nm, "username":un, "password":pw, "email":em});
  db.collection("users").findOne({"username": un}, function(err, doc) {
    if(doc) {
      console.log("found user!");
      sendPath = '/secrets.html';
      res.sendFile(publicPath + sendPath);
    } else {
      console.log("username does not exist!");
      // sendPath = '/login.html';
      // res.sendFile(publicPath + sendPath);
   }
  });

  console.log("save successful!");
});

// post from create account page
app.post('/createAccount.html?*', function(req, res) { 
  var nm = req.body.name;
  var un = req.body.username;
  var pw = req.body.password;
  var em = req.body.email;
  console.log('name: ' + nm + ' username: ' + un + ' password: ' + pw + ' email: ' + em);
  db.collection("users").save({"name":nm, "username":un, "password":pw, "email":em});
  console.log("new account created!");
  res.sendFile(publicPath + '/login.html');
});

// post from forgotPassword page
app.post('/forgotPassword.html?*', function(req, res) { 
  var em = req.body.email;
  console.log('email: ' + em);
  db.collection("users").findOne({"email": em}, function(err, doc) {
    if(doc) {
      console.log("email: " + em);
      sendPath = '/login.html';
      res.sendFile(publicPath + sendPath);
    } else {
      console.log("email does not exist!");
      // sendPath = '/login.html';
      // res.sendFile(publicPath + sendPath);
   }
  });
  // res.send(publicPath + '/login.html');
});






  // db.collection("users").find({}, function(err, docs) {
  //   docs.each(function(err, doc) {
  //     if(doc) {
  //       console.log(doc);
  //     }
  //   });
  // });