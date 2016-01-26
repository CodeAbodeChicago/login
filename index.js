// index.js for login!

// http://blog.modulus.io/mongodb-tutorial
// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
// https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens

// body-parser object for getting post params
// https://www.npmjs.com/package/body-parser


// ***** require modules
var express = require('express');
var app = express();


var bodyParser = require('body-parser');

var path = require('path');
var mongodb = require('mongodb');

var jwt = require('jsonwebtoken'); // used to create, sign, and authenticate json web tokens
// https://github.com/auth0/node-jsonwebtoken
// --> 'npm install jsonwebtoken --save'


// ***** configuration
// serve static files in public path 
var publicPath = path.join(__dirname, "public");

var port = process.env.PORT || 3000; // for deploying to heroku
var server; // global variable for server
var url = 'mongodb://localhost:27017/data'; // connection url
var db; // global variable for database
var secretKey = "elephantTornado";

var currentUser = {};

var MongoClient = mongodb.MongoClient; // mongoclient connects to mongodb server

app.set("secretKey", secretKey); // secret variable



// ***** middleware
app.use(express.static(publicPath));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



// routing
// redirect to login page
app.get('/', function(req, res) { 
  res.redirect('/login.html');
});


var apiRoutes = express.Router(); // from token auth tutorial


// post from login page
apiRoutes.post('/login.html?*', function(req, res) { 
  var un = req.body.username;
  var pw = req.body.password;

  console.log(req.body['x-acess-token']);
  db.findOne({"username": un}, function(err, doc) {
    if(!doc) {
      console.log("username does not exist!");
      // res.redirect('/login.html');
    } else if (doc) {
      if (doc.password != pw) {
        console.log("wrong password");
        // res.redirect('/login.html');
      } else {
        console.log("login successful!");

        // if user is found and password is right
        // create a token
        var token = jwt.sign(doc.username, app.get('secretKey'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.send({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });

        // res.redirect('/secrets.html');
      }
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
  db.findOne({"username": un}, function(err, doc) {
    if(doc) {
      console.log("found user!");
      // res.redirect('/secrets.html');
    } else {
      console.log("username does not exist!");
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
  db.findOne({"username": un}, function(err, doc) {
    if(doc) {
      console.log("found user!");
      // res.redirect('/secrets.html');
    } else {
      console.log("username does not exist!");
      db.insert({"name":nm, "username":un, "password":pw, "email":em});
      console.log("new account created!");
   }
  });
});

// post from forgotPassword page
app.post('/forgotPassword.html?*', function(req, res) { 
  var em = req.body.email;
  console.log('email: ' + em);
  db.findOne({"email": em}, function(err, doc) {
    if(doc) {
      console.log("email: " + em);
      // res.redirect('/login.html');
    } else {
      console.log("email does not exist!");
   }
  });
});




apiRoutes.use(function(req, res, next) {
  // check header, url, or post for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log("netflix and chill");
  // decode token
  if (token) {
    // verify secret
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) {
        return res.send('failed to authenticate token.');
      } else {
        // if things are good, save request
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send("no token provided");
  }
});

app.use(apiRoutes);


// show all users
app.get('/users', function(req, res) { 
  db.find().toArray(function(err, doc) {
    if(doc) {
      console.log('win!');
      res.send(doc);
    } else {
      console.log("did not find a name!");
   }
  });
});


apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
  console.log("you are requesting users");
  User.find({}, function(err, users) {
    res.json(users);
  });
});

apiRoutes.get('/check', function(req, res) {
  res.json(req.decoded);
});

app.use('/api', apiRoutes);


// ***** Initialize connection to database once
MongoClient.connect(url, function(err, database) {
  if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
  else console.log('Connection established to', url); // HURRAY!! We are connected. :)

    // db = database;
    db = database.collection("users");
  }
});


// Start the application after the database connection is ready
server = app.listen(port, function() {
  console.log("listening on *:" + port);
});





// eyJhbGciOiJIUzI1NiJ9.YWRtaW4.gSj29-xH0EvKFGALPiqzIccMHvlrJ5-uwNxamLsNnuU
// eyJhbGciOiJIUzI1NiJ9.dHJleA.J4jCc1NE-twI7Ucreqgeqv8LzjJUeEkkzIFPxp_ak8M