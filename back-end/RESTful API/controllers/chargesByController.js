const Pass = require('../models/passModel');
const { checkAndFormatDate } = require('../utils/checkAndFormatDate_util');

const chargesBy = async (req, res) => {
    try {
        const _requestTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16); // date at the time of call in YYYY-MM-DD HH:MM

        const { tollOpID, date_from, date_to } = req.params; // Getting the Path Parameters
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


        const queryResult = await Pass.aggregate([
            {
                $match: { // Filter documents based on the query
                    tollID: {$regex: `^${tollOpID}`},
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: { // Group by tag operator
                    _id: "$tagHomeID",
                    nPasses: { $sum: 1 },
                    totalCost: { $sum: '$charge' }
                }
            },    
            { 
                $match: { // Filtering to exclude the operator in question
                    _id: { $ne: tollOpID }
                }
            },
            {
                $project: { // Formating the result
                    _id: 0,  // Remove MongoDB's default _id field
                    visitingOpID: "$_id", // Rename _id to visitingOpID
                    nPasses: 1,
                    totalCost: 1
                }
            }
        ])

        // Prepare response object
        const response = {
            tollOpID: tollOpID,
            requestTimestamp: _requestTimestamp,
            periodFrom: date_from,
            periodTo: date_to,
            vOpList: queryResult.map((pass) => ({
                visitingOpID: pass.visitingOpID,
                nPasses: pass.nPasses,
                passesCost: pass.totalCost
            }))
        };
    

        // Handle response format
        if (format === 'csv') {
            const csvHeader = "tollOpID,requestTimestamp,periodFrom,periodTo,visitingOpID,nPasses,passesCost\n";
            const csvRows = response.vOpList
                .map(p => `${tollOpID},${_requestTimestamp},${date_from},${date_to},${p.visitingOpID},${p.nPasses},${p.passesCost}`)
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

module.exports = { chargesBy };
