var Schema = require('mongoose').Schema
var moment = require('moment-timezone');

//Date
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

var busSchema = new Schema({
    id: String,
    latitude: String,
    longitude: String,
    route: String,
    timestamp: { type: String, default: Date.now() }
}, {collection: 'bus'})

var Bus = module.exports = busSchema
