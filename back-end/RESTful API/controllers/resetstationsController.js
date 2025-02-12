const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const Toll = require('../models/tollStationModel');

const resetstations = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/tollstations2024.csv');
        let tolls = [];

        await Toll.deleteMany({});
        console.log('All toll stations deleted.');

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

        tolls = csvData.map(row => {
            //console.log('Parsed Row:', row);

            if (!row.TollID || !row.Name || !row.Locality ||
                isNaN(parseFloat(row.Lat)) || isNaN(parseFloat(row.Long)) ||
                isNaN(parseFloat(row.Price1)) || isNaN(parseFloat(row.Price2)) ||
                isNaN(parseFloat(row.Price3)) || isNaN(parseFloat(row.Price4))) {
                console.warn('Skipping invalid row:', row);
            return null;
                }

                return {
                    OpID: row.Operator,
                    Operator: row.Operator,
                    TollID: row.TollID,
                    Name: row.Name,
                    PM: row.PM,
                    Locality: row.Locality,
                    Road: row.Road,
                    Lat: parseFloat(row.Lat),
                            Long: parseFloat(row.Long),
                            Email: row.Email,
                            Price1: parseFloat(row.Price1),
                            Price2: parseFloat(row.Price2),
                            Price3: parseFloat(row.Price3),
                            Price4: parseFloat(row.Price4)
                };
        }).filter(toll => toll !== null);

        if (tolls.length > 0) {
            await Toll.insertMany(tolls);
            res.status(200).json({ message: 'Toll stations reset successfully.' });
        } else {
            res.status(200).json({ message: 'No valid toll stations to insert.' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
};

module.exports = { resetstations };
