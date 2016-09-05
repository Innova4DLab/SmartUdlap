var Schema = require('mongoose').Schema
var moment = require('moment-timezone');

//Date
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
//dateFormat(Date.now(), "dd-mm-yyyy:HH:MM:ss")

var busSSchema = new Schema({
    name: String,
    latitude: String,
    longitude: String,
    schedule: [String],
    imagen: Buffer 
}, {collection: 'parada'})

var BusStop = module.exports = busSSchema

//[{"Hora":"12:40,16:30,","Ruta":"Capu"},{"Hora":13:00,"Ruta":"Puebla"}]