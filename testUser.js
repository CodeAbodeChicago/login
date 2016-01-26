// test connection to mongodb server and
// create a test 'admin' user

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient; // mongoclient connects to mongodb server
var url = 'mongodb://localhost:27017/data'; // connection url

var bCrypt = require('bcrypt-nodejs'); // for password encryption


// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url); // HURRAY!! We are connected. :)

    var collection = db.collection('users'); // Get the users collection

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

    //Create test user
    var defaultAdmin = {
			name: 'admin',
			email: 'admin@test.com',
			username: 'admin',
			password: ''
		};

    defaultAdmin.password = createHash("test");

    // Insert test user
    collection.insert(defaultAdmin, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
      //Close connection
      db.close();
    });
  }
});


