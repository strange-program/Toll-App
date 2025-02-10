const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');

const healthCheck = async (req, res) => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/TollDatabase';

        const isConnected = mongoose.connection.readyState === 1;
        const n_stations = await TollStation.countDocuments();

        const query = await Pass.aggregate([
            { $group: { _id: "$tagRef" } },  // Group by distinct tagRef values
            { $count: "count" }              // Count the number of groups
          ]);
        const n_tags = query.length > 0 ? query[0].count : 0;

        const n_passes = await Pass.countDocuments();

        
        if (isConnected) {
            return res.status(200).json({
                status: 'OK',
                dbconnection: mongoURI,
                n_stations,
                n_tags,
                n_passes
            });
        } else {
            return res.status(401).json({
                status: 'failed',
                dbconnection: mongoURI
            });
        }
    } catch (error) {
        return res.status(401).json({ status: 'failed' });
    }
};

module.exports = { healthCheck };
