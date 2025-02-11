const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const moment = require('moment');
const csv = require('csv-parser');
const os = require('os');
const express = require('express');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');
const { checkAndFormatDate } = require('../utils/checkAndFormatDate_util');



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
      
    const values = row["timestamp;tollID;tagRef;tagHomeID;charge"].split(";");
  
  if (values.length !== 5) {
    console.warn("Skipping invalid row:", row);
    return null;
  }

      return {
        timestamp: convertTimestamp(values[0]), // Use the timestamp directly, no conversion
        tollID: values[1],
        tagRef: values[2],
        tagHomeID: values[3],
        charge: parseFloat(values[4])
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

function convertTimestamp(timestamp) {
  // Διαχωρίζουμε ημερομηνία & ώρα
  let [datePart, timePart, meridian] = timestamp.split(/[\s]+/); // Διαχωρισμός με κενά

  // Σπάμε την ημερομηνία
  let [day, month, year] = datePart.split("/");

  // Σπάμε την ώρα
  let [hours, minutes] = timePart.split(":");

  // Μετατροπή ώρας σε 24ωρη μορφή
  hours = parseInt(hours, 10);
  if (meridian === "μμ" && hours !== 12) {
      hours += 12; // Αν είναι μμ (PM) προσθέτουμε 12 ώρες
  } else if (meridian === "πμ" && hours === 12) {
      hours = 0; // Αν είναι 12 πμ (μεσάνυχτα) το κάνουμε 00
  }

  // Δημιουργούμε την input μορφή για checkAndFormatDate
  let formattedDate = `${year}${month.padStart(2, "0")}${day.padStart(2, "0")}`;
  let formattedTime = `${hours.toString().padStart(2, "0")}${minutes}`;
  // Καλούμε τη συνάρτηση
  return checkAndFormatDate(formattedDate, formattedTime);
}

module.exports = { addPasses };
