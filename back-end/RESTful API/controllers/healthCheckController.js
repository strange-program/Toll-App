const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');

const healthCheck = async (req, res) => {
    try {
        const isConnected = mongoose.connection.readyState === 1;
        const n_stations = await TollStation.countDocuments();
        const n_tags = await Pass.distinct('tagRef').countDocuments();
        const n_passes = await Pass.countDocuments();

        if (isConnected) {
            return res.status(200).json({
                status: 'OK',
                dbconnection: 'mongodb://localhost:27017/TollDatabase',
                n_stations,
                n_tags,
                n_passes
            });
        } else {
            return res.status(401).json({ status: 'failed' });
        }
    } catch (error) {
        return res.status(401).json({ status: 'failed' });
    }
};

module.exports = { healthCheck };
