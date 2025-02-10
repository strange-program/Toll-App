// utils/upload.js

const fs = require('fs');
const moment = require('moment');
const csv = require('csv-parser');
const os = require('os');
const multer = require('multer');
const Pass = require('../models/passModel');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir()); // Save to OS temporary directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Process the CSV file
const processCSV = async (filePath) => {
    return new Promise((resolve, reject) => {
        const rows = [];
        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Clean up BOM and unnecessary characters
            const cleanedRow = {};
            Object.keys(row).forEach(key => {
                const cleanedKey = key.replace(/^\ufeff/, '').trim(); // Remove BOM and trim
                cleanedRow[cleanedKey] = row[key].trim(); // Trim extra spaces
            });
            rows.push(cleanedRow);
        })
        .on('end', () => resolve(rows))
        .on('error', (err) => reject(err));
    });
};

// Process passes data to ensure it's in the correct format
const processPasses = (csvData) => {
    return csvData.map(row => {
        const timestamp = row.timestamp;

        // Validate timestamp and convert it to ISO string
        const validTimestamp = moment.utc(timestamp, "YYYY-MM-DD HH:mm", true).isValid()
        ? moment.utc(timestamp, "YYYY-MM-DD HH:mm").toISOString()
        : null;

        if (!validTimestamp) {
            console.warn(`Invalid timestamp found: ${timestamp}`);
            return null; // Skip invalid rows
        }

        return {
            timestamp: validTimestamp,
            tollID: row.tollID,
            tagRef: row.tagRef || '',
            tagHomeID: row.tagHomeID || '',
            charge: parseFloat(row.charge)
        };
    }).filter(pass => pass !== null); // Filter out invalid rows
};

// Check for existing passes to avoid duplicates
const checkExistingPasses = async (passesToInsert) => {
    const existingPasses = await Pass.find({
        $or: passesToInsert.map(pass => ({
            tollID: pass.tollID,
            timestamp: pass.timestamp,
            tagRef: pass.tagRef,
            tagHomeID: pass.tagHomeID,
            charge: pass.charge
        }))
    });

    const existingSet = new Set(existingPasses.map(p => `${p.tollID}_${p.timestamp}_${p.tagRef}_${p.tagHomeID}_${p.charge}`));
    return passesToInsert.filter(pass =>
    !existingSet.has(`${pass.tollID}_${pass.timestamp}_${pass.tagRef}_${pass.tagHomeID}_${pass.charge}`)
    );
};

module.exports = { upload, processCSV, processPasses, checkExistingPasses };
