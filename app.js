/* 

  app.js for login w/ passport.js!

  passport.js tutorials:
  http://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
  https://github.com/jay3dec/LocalAuthUsingPassport

  express-session tutorials:
  http://expressjs-book.com/index.html%3Fp=128.html

  body-parser object for getting post params
  https://www.npmjs.com/package/body-parser

  bCrypt for encrypting/decrypting passwords
  https://www.npmjs.com/package/bcrypt-nodejs

*/


// ***** Require Modules *****
var express = require("express");
var path = require("path");
var https = require("https"); // for secure http requests
var passport = require("passport"); // for authentication
var LocalStrategy = require("passport-local").Strategy; // for username/password authentication
var mongodb = require("mongodb");
var bCrypt = require("bcrypt-nodejs"); // for password encryption
var cookieSession = require("cookie-session");

// ***** Setup app *****
var app = express();

// ***** Setup db *****
var MongoClient = mongodb.MongoClient; // mongoclient connects to mongodb server
var url = "mongodb://localhost:27017/data"; // connection url
var db; // global variable for database



// ***** Initialize connection to database *****
MongoClient.connect(url, function(err, database) {
  if (err) console.log("Unable to connect to the mongoDB server. Error:", err);
  else console.log("Connection established to", url); // HURRAY!! We are connected.

  db = database.collection("users");
});



// ***** Serve public folder for static files *****
var publicPath = path.join(__dirname, "public");
var staticHandler = express.static(publicPath);
app.use(staticHandler);



// ***** Middleware *****
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.json());
app.use(express.urlencoded());
// app.use(express.methodOverride()); --> i don't know what this does yet...

// sessions test
app.use(cookieSession({ secret: "ElephantTornado"} ));
// app.use(function(req, res) {
//   req.session.count = req.session.count || 0;
//   var n = req.session.count++;
//   res.send("viewed " + n + " times\n");
// });

app.use(passport.initialize());
app.use(passport.session()); 
app.use(app.router);



// ***** Serialize and Deserialize users for sessions *****
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



// ***** Decrypting and comparing passwordsRequire Module *****
// Uses the bCrypt module
// user param is coming from the db, contains stored info about user
// password param is coming from login post
var isValidPassword = function(user, password) {

  // *** Note:
  // If password stored in database is not a valid hash, the program will break.
  // First, check how many salt rounds were used to encrypt the password.
  // If there were no rounds used, password is not a valid hash, and you can return false.
  // Otherwise, compare the submitted password with the saved password
  var passRounds = bCrypt.getRounds(user.password);

  if (isNaN(passRounds)) return false;
  else return bCrypt.compareSync(password, user.password);

};



// ***** Set up passport strategy for username/password authorization *****
passport.use("local", new LocalStrategy(
  function(username, password, done) {
   // look up username in database, if it is found, compare passwords
    db.findOne({"username":username},
    function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log("no username found!");
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log("password is wrong!");
        return done(null, false);
      }
      console.log("login successful!");
      return done(null, user);
    });
  }
));



// ***** Routing *****
app.get("/auth", function(req, res, next) {
  res.redirect("login.html");
});

app.get("/loginFailure" , function(req, res, next){
  // res.redirect("login.html");
  // res.send("Failure to authenticate");

  req.session.count = req.session.count || 0;
  var n = req.session.count++;
  res.send("AUTHENTICATION FAILED \n " + "viewed " + n + " times\n");


});

app.get("/loginSuccess" , function(req, res, next){
  // res.redirect("login.html");
  // res.send("Successfully authenticated");

  req.session.count = req.session.count || 0;
  var n = req.session.count++;
  res.send("SUCCESS!!!!!!!!!!!! \n " + "viewed " + n + " times\n");

});

app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/loginSuccess",
    failureRedirect: "/loginFailure"
  })
);



// ***** Start the application *****
// Wait until the database connection is ready
var port = process.env.PORT || 8080; // for deploying to heroku

var server = app.listen(port, function() {
  console.log("listening on *: " + port);
});


