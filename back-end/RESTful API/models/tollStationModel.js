const mongoose = require('mongoose');

const tollStationSchema = new mongoose.Schema({
    OpID: { type: String, required: true },
    Operator: { type: String, required: true },
    TollID: { type: String, required: true },
    Name: { type: String, required: true },
    PM: { type: String, required: true },
    Locality: { type: String, required: true },
    Road: { type: String, required: true },
    Lat: { type: Number, required: true },
    Long: { type: Number, required: true },
    Email: { type: String, required: true },
    Price1: { type: Number, required: true },
    Price2: { type: Number, required: true },
    Price3: { type: Number, required: true },
    Price4: { type: Number, required: true },
});

const TollStation = mongoose.model('TollStation', tollStationSchema, 'Tolls');

module.exports = TollStation;
