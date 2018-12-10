var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
mongo = require('mongodb');


/* Viser pærerne som JSON */
router.get('/json', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("IKEA-Traadfri");
    dbo.collection("SmartBulbs").find({}).toArray(function (err, result) {
      if (err) throw err;
      // console.log(result);
      var obj = {};
      obj.smartbulb = result;
      res.json(obj);
      db.close();
    });
  });
});

/* Viser pærerne som en HTML side */
router.get('/', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("IKEA-Traadfri");
    dbo.collection("SmartBulbs").find({}).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      var obj = {};
      obj.smartbulb = result;
      res.render('smartbulb', obj);
      db.close();
    });
  });
});

/* Post requests opretter en ny pære */
router.post('/json', function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("IKEA-Traadfri");
    var smartbulb = {};
    smartbulb.color = req.body.color;
    smartbulb.on = req.body.on;
    smartbulb.lightIntensity = req.body.lightIntensity;
    smartbulb.powerUsageActual = req.body.powerUsageActual;
    smartbulb.powerUsageNominal = req.body.powerUsageNominal;
    smartbulb.hardwareType = req.body.hardwareType;
    smartbulb.softwareVersion = req.body.softwareVersion;

    console.log("Farven på den nye pære er " + req.body.color) ;
    dbo.collection("SmartBulbs").insertOne(smartbulb, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
    res.redirect("/smartbulb/json");
  });
});  

router.post('/delete/:id', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("IKEA-Traadfri");
  var id = req.params.id;
  dbo.collection("SmartBulbs").deleteOne({ _id: new mongo.ObjectId(id) }, function (err, results) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });

  //res.json({ success: id })
  res.redirect("/smartbulb");
});
});

module.exports = router;