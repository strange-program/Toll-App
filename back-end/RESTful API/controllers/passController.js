const Pass = require('../models/passModel');
const TollStation = require('../models/tollStationModel');
const { convertDateFormat } = require('../utils/dateUtils');

const getPassesForTollStation = async (req, res) => {
    try {
        const { tollStationID, date_from, date_to } = req.params;

        // Validate date format
        if (!/^\d{8}$/.test(date_from) || !/^\d{8}$/.test(date_to)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const tollStation = await TollStation.findOne({ TollID: tollStationID });
        if (!tollStation) {
            return res.status(404).json({ message: 'Toll station not found' });
        }

        const passes = await Pass.find({ tollID: tollStationID });

        // Convert and filter passes based on date range
        const filteredPasses = passes.filter(pass => {
            const formattedTimestamp = pass.timestamp instanceof Date
            ? parseInt(`${pass.timestamp.getUTCFullYear()}${String(pass.timestamp.getUTCMonth() + 1).padStart(2, '0')}${String(pass.timestamp.getUTCDate()).padStart(2, '0')}`, 10)
            : null;
            return formattedTimestamp >= date_from && formattedTimestamp <= date_to;
        }).sort((a, b) => a.timestamp - b.timestamp);

        if (filteredPasses.length === 0) {
            return res.status(204).send(); // No content
        }

        const analysis = {
            stationID: tollStation.TollID,
            stationOperator: tollStation.Operator,
            requestTimestamp: new Date().toISOString(),
            periodFrom: convertDateFormat(date_from),
            periodTo: convertDateFormat(date_to),
            nPasses: filteredPasses.length,
            passList: filteredPasses.map((pass, index) => ({
                passIndex: index + 1,
                passID: pass._id,
                timestamp: pass.timestamp,
                tagID: pass.tagRef,
                tagProvider: pass.tagHomeID,
                passType: pass.tagHomeID === tollStation.OpID ? 'home' : 'visitor',
                passCharge: pass.charge
            }))
        };

        res.status(200).json(analysis);
    } catch (error) {
        console.error('Error fetching toll station passes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getPassesForTollStation };
