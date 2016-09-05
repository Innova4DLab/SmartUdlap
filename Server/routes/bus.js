var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment-timezone');
//Define Schema
var busSchema = require('../models/bus');
var geolib = require('geolib');

//Setting Schema to the Model
var busModel = mongoose.model('bus', busSchema);
//Get data
var data = require('../data');

//Respose
router.get('/get', function(req, res, next) {
	busObject = data.getBus();//Get reference of Bus Array
	res.json(busObject);
});

router.get('/save', function(req, res, next) {
	if(req.query.id && req.query.latitude && req.query.longitude && req.query.route){//Check if parameters are correct
			saveNewLoc(req.query.id, req.query.latitude, req.query.longitude, req.query.route);//Save the bus information on the Array

			var location = new busModel({
			 		id: req.query.id,
			    latitude: req.query.latitude,
			    longitude: req.query.longitude,
			    route: req.query.route,
			    timestamp: Date.now()
			});
			location.save(function (err, newBus) {
				  if (err) return console.error(err);
				  console.log("Saved->Latitude:"+newBus.latitude+":Longitude:"+newBus.longitude);
				  res.send("Saved");
			});
	}else{
			res.send("Missing parameters");
	}
});

function saveNewLoc(busId, latitude, longitude, route){//Save the new location in the array
	busObject = data.getBus();//Get reference of Bus Array
	if( !busObject.hasOwnProperty(busId) ){//If the object not exist -> Initialize object
		busObject[busId] = {};
		busObject[busId].actual1 = -1;
		busObject[busId].actual2 = -1;
		busObject[busId].stop = -1;
	}

	collitions = getCNeighbors(route, 2, latitude, longitude);//Detect first two closeness neighbors


	//Check difference of time
	var diff = moment.duration(Date.now()).asSeconds() - moment.duration(busObject[busId].timestamp).asSeconds();
	console.log("Difference->"+diff);
	if(diff > 60){
			//Restart variables
			busObject[busId].actual1 = -1;
			busObject[busId].actual2 = -1;
			busObject[busId].stop = -1;
	}

	if(collitions.length > 0){//If  exist collition update
			var t = 2;//Valor de tolerancia. Pensando en las perdidas de red.(Hasta cuantas paradas se pueden omitir


			//Correct Errors
			if( busObject[busId].actual1 != -1 ){//Data required is setted

					if( (collitions[0].stopIndex != busObject[busId].actual1) ||
						( (collitions[0].stopIndex != busObject[busId].actual1) && (collitions.length>1 && collitions[1].stopIndex != busObject[busId].actual1) ) ){
								var updated=0;
								//Manejar distintos ordenes posibles de los numeros
								if( collitions[0].stopIndex > busObject[busId].actual1 && collitions[0].stopIndex <= busObject[busId].actual1 + (1 + t) ){
									busObject[busId].actual1 = collitions[0].stopIndex;
									updated=1;
								}else if( collitions[0].stopIndex > busObject[busId].actual2 && collitions[0].stopIndex <= busObject[busId].actual2 + (1 + t) ){
									busObject[busId].actual1 = collitions[0].stopIndex;
									updated=1;
								}else if( collitions.length>1 && collitions[1].stopIndex > busObject[busId].actual1 && collitions[1].stopIndex <= busObject[busId].actual1 + (1 + t) ){
									busObject[busId].actual1 = collitions[1].stopIndex;
									updated=1;
								}else if( collitions.length>1 && collitions[1].stopIndex > busObject[busId].actual2 && collitions[1].stopIndex <= busObject[busId].actual2 + (1 + t) ){
									busObject[busId].actual1 = collitions[1].stopIndex;
									updated=1;
								}
								//If was change update variables
								if(updated!=0){
									busObject[busId].actual2 = -5000;
									busObject[busId].stop = busObject[busId].actual1;
									//busObject[busId].timestamp = moment.tz(Date.now(), "America/Mexico_City").format();
									busObject[busId].timestamp = Date.now();
								}
					}
			}else{//Initialize data
						busObject[busId].actual1 = collitions[0].stopIndex;
						if( collitions.length>1 ){
								busObject[busId].actual2 = collitions[1].stopIndex;
						}
						busObject[busId].timestamp = Date.now();
			}
	}

	//Override with the new data
	busObject[busId].lat = latitude;
	busObject[busId].lng = longitude;
	busObject[busId].route = route;
	console.log("Current stop->"+busObject[busId].stop+"-time->"+busObject[busId].timestamp );

}

function getCNeighbors(route, nNeighbors, currentLat, currentLng){//Get N first closeness neighbors
	busStops = data.getData();//Get reference of BusStops
	neighbors = [];
	var radioDistance = 200;
	if(busStops.hasOwnProperty(route)){//Exist the route
		var index=0;
		for(var i=0; i < busStops[route].length; i++){
				var distance = geolib.isPointInCircleDist(
				    {latitude: busStops[route][i].lat, longitude: busStops[route][i].long},
				    {latitude: currentLat, longitude: currentLng},
				    radioDistance
				);
				if(distance != -1){//If is closeness to radioDistance
						neighbors[index] = {};//Create object in index
						neighbors[index].stopIndex = i;
						console.log("Encontre->"+i+"distance->"+distance);
						neighbors[index].distance = distance;
						index += 1;
				}
		}

		//Sort by lower distances
		for(var x=0; x < neighbors.length ;x++){
				for(var y=x; y < neighbors.length ;y++){
						if( neighbors[y].distance < neighbors[x].distance ){
								var distanceTemp = neighbors[y].distance;
								var stopIndexTemp = neighbors[y].stopIndex;
								neighbors[y].distance = neighbors[x].distance;
								neighbors[y].stopIndex = neighbors[x].stopIndex;
								neighbors[x].distance = distanceTemp;
								neighbors[x].stopIndex = stopIndexTemp;
						}
				}
		}

		neighbors = neighbors.splice(0, nNeighbors);
	}
	return neighbors;
}

module.exports = router;
