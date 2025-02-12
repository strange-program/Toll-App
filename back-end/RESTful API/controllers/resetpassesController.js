const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const Pass = require('../models/passModel'); // Ensure this is the correct path to your model

const resetpasses = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/passes2024.csv');
        let passes = [];

        await Pass.deleteMany({});
        console.log('All passes deleted.');

        const csvData = await new Promise((resolve, reject) => {
            const rows = [];
            fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const cleanedRow = {};
                Object.keys(row).forEach(key => {
                    const cleanedKey = key.replace(/^﻿/, '').trim();
                    cleanedRow[cleanedKey] = row[key].trim();
                });
                rows.push(cleanedRow);
            })
            .on('end', () => resolve(rows))
            .on('error', (err) => reject(err));
        });

        passes = csvData.map(row => {
            //console.log('Parsed Row:', row);

            if (!row.timestamp || !row.tollID || !row.tagRef || !row.tagHomeID || isNaN(parseFloat(row.charge))) {
                console.warn('Skipping invalid row:', row);
                return null;
            }

            return {
                timestamp: row.timestamp,
                tollID: row.tollID,
                tagRef: row.tagRef,
                tagHomeID: row.tagHomeID,
                charge: parseFloat(row.charge),
            };
        }).filter(pass => pass !== null);

        if (passes.length > 0) {
            await Pass.insertMany(passes);
            res.status(200).json({ message: 'Pass records reset successfully.' });
        } else {
            res.status(200).json({ message: 'No valid pass records to insert.' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
};

module.exports = { resetpasses };
