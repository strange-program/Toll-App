const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const moment = require('moment');
const csv = require('csv-parser');
const os = require('os');
const express = require('express');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');



const router = express.Router(); // Χρήση του router αντί του app


const addPasses = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;
  let passesToInsert = [];

  try {
    const csvData = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Clean up row keys and values
        const cleanedRow = {};
        Object.keys(row).forEach(key => {
          const cleanedKey = key.replace(/^\ufeff/, '').trim();
          cleanedRow[cleanedKey] = row[key].trim();
        });
        rows.push(cleanedRow);
      })
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
    });

    passesToInsert = csvData.map(row => {

      if (!row.timestamp || !row.tollID || !row.tagRef || !row.tagHomeID || isNaN(parseFloat(row.charge))) {
        console.warn('Skipping invalid row:', row);
        return null;
      }

      return {
        timestamp: row.timestamp, // Use the timestamp directly, no conversion
        tollID: row.tollID,
        tagRef: row.tagRef,
        tagHomeID: row.tagHomeID,
        charge: parseFloat(row.charge)
      };
    }).filter(pass => pass !== null);

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
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });
  }
};



module.exports = { addPasses };
