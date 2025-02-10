const Pass = require('../models/passModel');
const { checkAndFormatDate } = require('../utils/checkAndFormatDate_util');

const passesCost = async (req, res) => {
    try {
        const _requestTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16); // date at the time of call in YYYY-MM-DD HH:MM

        const { tollOpID, tagOpID, date_from, date_to } = req.params; // Getting the Path Parameters
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
        if(!(operators.has(tollOpID))) {
            return res.status(400).json({ message: 'Invalid Toll Operator ID: no operator with that ID' });
        }
        if(!(operators.has(tagOpID))) {
            return res.status(400).json({ message: 'Invalid Tag Operator ID: no operator with that ID' });
        }

        // Returns the number of passes and the total cost of those passes in the format [{_id, passes, totalCharge}]
        const queryResult = await Pass.aggregate([
            { $match: // Filter documents based on the query
                {
                    tollID: {$regex: `^${tollOpID}`}, // checks if the first 2-3 characters of the tollID match the tollOpID
                    tagHomeID: tagOpID,
                    timestamp: {
                        $gte: startDate, // Greater than or equal to start date
                        $lte: endDate // Less than or equal to end date
                    }
                }
            }, 
            { $group: {
                _id: null, // Group all matching documents
                passes: { $sum: 1 }, // Count the documents in the group
                passesCost: { $sum: "$charge" } // Sum the "charge" field
              }
            }
        ])

        var { passes = 0, passesCost = 0 } = queryResult[0] || {}; // destructuring the result
        if(tollOpID === tagOpID) passesCost = 0; // no debt owed

        // Prepare response object
        const response = {
            tollOpID: tollOpID,
            tagOpID: tagOpID,
            requestTimestamp: _requestTimestamp,
            periodFrom: date_from,
            periodTo: date_to,
            nPasses: passes,
            passesCost: passesCost
        };
    

        // Handle response format
        if (format === 'csv') {
            const csvHeader = "tollOpID,tagOpID,requestTimestamp,periodFrom,periodTo,nPasses,passesCost\n";
            const csvRows = `${tollOpID},${tagOpID},${_requestTimestamp},${date_from},${date_to},${passes},${passesCost}\n`;
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

module.exports = { passesCost };
