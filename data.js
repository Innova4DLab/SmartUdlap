var fs = require('fs');

var busStop = null;
exports.getData = function () {
  if (!busStop) {
	  	var contents = fs.readFileSync("/home/dave/nodeCode/busStopData.json");
		busStop = JSON.parse(contents);
  }
  return busStop;
};

var bus = null;
exports.getBus = function () {
  if (!bus) {
		bus = {};//Object
  }
  return bus;
};
