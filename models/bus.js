var Schema = require('mongoose').Schema
var moment = require('moment-timezone');

//Date
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//dateFormat(Date.now(), "dd-mm-yyyy:HH:MM:ss")

var busSchema = new Schema({
    id: String,
    latitude: String,
    longitude: String,
    route: String,
    timestamp: { type: String, default: moment.tz(Date.now(), "America/Mexico_City").format() }
}, {collection: 'bus'})

var Bus = module.exports = busSchema