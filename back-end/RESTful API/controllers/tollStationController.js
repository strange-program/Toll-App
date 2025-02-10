const TollStation = require('../models/tollStationModel');

const getAllTollStations = async (req, res) => {
    try {
        const tollStations = await TollStation.find();
        if (tollStations.length === 0) {
            return res.status(204).send(); // No content
        }
        res.status(200).json(tollStations);
    } catch (error) {
        console.error('Error fetching toll stations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAllTollStations };
