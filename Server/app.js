var express = require('express');
var app = express();//Initialize instance of express
var mongoose = require('mongoose');
var fs = require('fs');
var geolib = require('geolib');

//Probes
console.log(geolib.isPointInCircle(
		{latitude: 19.062501, longitude: -98.29663},
		{latitude: 19.062511, longitude: -98.29643},
		50));

//
mongoose.connect('mongodb://127.0.0.1/smartudlap');//Connect to the mongodb "server:database"
var db = mongoose.connection;//Reference to the mongodb connection

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	console.log("connected!!!");
});

//Configure Web Server
var bus = require('./routes/bus');
var busStop = require('./routes/busstop');

app.use('/bus/', bus);
app.use('/busstop/', busStop);

//Initialize HTTP Server
app.listen(443, function () {
  console.log('Example app listening on port 443!');
});
