// controllers/passesController.js

const fs = require('fs');
const moment = require('moment');
const Pass = require('../models/passModel');
const { processCSV, processPasses, checkExistingPasses } = require('../utils/upload');

// Controller for adding passes
const addPasses = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    let passesToInsert = [];

    try {
        // Step 1: Process CSV and clean the data
        const csvData = await processCSV(filePath);
        console.log(`Processed ${csvData.length} rows from CSV.`);

        // Step 2: Process and clean the passes data
        passesToInsert = processPasses(csvData);

        // Step 3: Check for existing passes in the database to avoid duplicates
        passesToInsert = await checkExistingPasses(passesToInsert);

        // If there are new passes, insert them
        if (passesToInsert.length > 0) {
            await Pass.insertMany(passesToInsert);
            res.status(200).json({ message: 'Passes added successfully' });
        } else {
            res.status(200).json({ message: 'No new passes to insert' });
        }
    } catch (err) {
        console.error('Error processing CSV:', err);
        res.status(500).json({ message: 'Error processing CSV file' });
    } finally {
        // Step 4: Cleanup the temporary file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting temporary file:', err);
        });
    }
};

module.exports = { addPasses };
