const Pass = require('../models/passModel');
const { checkAndFormatDate } = require('../utils/checkAndFormatDate_util');

const passAnalysis = async (req, res) => {
    try {
        const _requestTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16); // date at the time of call in YYYY-MM-DD HH:MM

        const { stationOpID, tagOpID, date_from, date_to } = req.params; // Getting the Path Parameters
        const format = req.query.format || 'json'; // Getting the Query Parameters (default to JSON)

        // Validate and format date (expecting YYYYMMDD, returning YY-MM-DD hh:mm)
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

        const operators = new Set(['AM', 'EG', 'GE', 'KO', 'MO', 'NAO', 'NO', 'OO'])
        if(!(operators.has(stationOpID))) {
            return res.status(400).json({ message: 'Invalid Station Operator ID: no operator with that ID' });
        }
        if(!(operators.has(tagOpID))) {
            return res.status(400).json({ message: 'Invalid Tag Operator ID: no operator with that ID' });
        }
        
        // Query MongoDB for passes that satisfy the IDs for toll and tag
        // The first 2 characters of tollID and tagRef are the OpID of the owner of the toll and tag respectively
        const passes = await Pass.find({
            tollID: {$regex: `^${stationOpID}`}, // checks if the first 2-3 characters of the tollID match the stationOpID
            tagHomeID: tagOpID,
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
            stationOpID: stationOpID,
            tagOpID: tagOpID,
            requestTimestamp: _requestTimestamp,
            periodFrom: date_from,
            periodTo: date_to,
            nPasses: passes.length,
            passList: passes.map((pass, index) => ({
                passIndex: index + 1,
                passID: pass._id.toString(),
                stationID: pass.tollID,
                timestamp: pass.timestamp,
                tagID: pass.tagRef,
                passCharge: pass.charge
            }))
        };

        // Handle response format
        if (format === 'csv') {
            const csvHeader = "stationOpID,tagOpID,requestTimestamp,periodFrom,periodTo,nPasses,passIndex,passID,stationID,timestamp,tagID,passCharge\n";
            const csvRows = response.passList
                .map(p => `${stationOpID},${tagOpID},${_requestTimestamp},${date_from},${date_to},${passes.length}${p.passIndex},${p.passID},${p.stationID},${p.timestamp},${p.tagID},${p.passCharge}`)
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

module.exports = { passAnalysis };
