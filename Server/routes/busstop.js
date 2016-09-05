var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment-timezone');
//Define Schema
var busSSchema = require('../models/paradas');

//Setting Schema to the Model
var busSModel = mongoose.model('parada', busSSchema);

//Respose
router.get('/save', function(req, res, next) {
	if( req.query.name && req.query.schedule && req.query.latitude && req.query.longitude ){
		var parada = new busSModel({
		 	name: req.query.name,
		 	schedule: req.query.schedule.split(","),
		    latitude: req.query.latitude,
		    longitude: req.query.longitude,
		    timestamp: moment.tz(Date.now(), "America/Mexico_City").format(),
		    image: 'base64'
		});
		parada.save(function (err, newBus) {
		  if (err) return console.error(err);
		  console.log("Saved");
		  res.send("Saved");
		});
	}else{
		res.send("Missing parameters");
	}
});

router.get('/get', function(req, res, next) {
	busSModel.find(
		function (err, lastUpdate) {
	  		if (err) return console.error(err);
	  		console.log(lastUpdate);
	  		res.json(lastUpdate);
	  		//res.send('Last Update->'+lastUpdate);
		}
	);
});

module.exports = router;
