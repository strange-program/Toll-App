const Pass = require('../models/passModel');
const TollStation = require('../models/tollStationModel');
const { checkAndFormatDate } = require('../utils/checkAndFormatDate_util');

const tollStationPasses = async (req, res) => {
    try {
        const _requestTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16); // date at the time of call in YYYY-MM-DD HH:MM
  
        const { tollStationID, date_from, date_to } = req.params; // Getting the Path Parameters
        const format = req.query.format || 'json'; // Getting the Query Parameters (default to JSON)
  
        // Validate and format date (expecting YYYYMMDD, returning YYYY-MM-DD hh:mm)
        try {
            startDate = checkAndFormatDate(date_from, "0000") 
            endDate = checkAndFormatDate(date_to, "2359") 
        }
        catch(error) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYYMMDD (e.g., 20250208).' });
        }
  
        if (startDate > endDate) {
            return res.status(400).json({ message: 'Invalid date range: start date cannot be later than end date' });
        }

        // Find toll station
        const tollStation = await TollStation.findOne({ TollID: tollStationID });
        if (!tollStation) {
            return res.status(400).json({ message: 'Toll station not found' });
        }
  
        // Query MongoDB for passes within the date range
        const passes = await Pass.find({
            tollID: tollStationID,
            timestamp: {
              $gte: startDate, // Greater than or equal to start date
              $lte: endDate // Less than or equal to end date
            }
        }).sort({ timestamp: 1 }); // Sort by timestamp
  
        if (passes.length === 0) {
            return res.status(204).send(); // No content
        }
  
        // Prepare response object
        const response = {
            stationID: tollStation.TollID,
            stationOperator: tollStation.Operator,
            requestTimestamp: _requestTimestamp,
            periodFrom: date_from,
            periodTo: date_to,
            nPasses: passes.length,
            passList: passes.map((pass, index) => ({
                passIndex: index + 1,
                passID: pass._id.toString(),
                timestamp: pass.timestamp,
                tagID: pass.tagRef,
                tagProvider: pass.tagHomeID,
                passType: pass.tagHomeID === tollStationID ? 'home' : 'visitor',
                passCharge: pass.charge
            }))
        };
  
        // Handle response format
        if (format === 'csv') {
            const csvHeader = "stationID,stationOperator,requestTimestamp,periodFrom,periodTo,nPasses,passIndex,passID,timestamp,tagID,tagProvider,passType,passCharge\n";
            const csvRows = response.passList
                .map(p => `${tollStation.TollID},${tollStation.Operator},${_requestTimestamp},${date_from},${date_to},${passes.length},${p.passIndex},${p.passID},${p.timestamp},${p.tagID},${p.tagProvider},${p.passType},${p.passCharge}`)
                .join("\n");
            res.setHeader("Content-Type", "text/csv");
            return res.status(200).send(csvHeader + csvRows);
        }
  
        // Default to JSON
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching toll station passes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { tollStationPasses };
