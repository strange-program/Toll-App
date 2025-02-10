const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');


const express = require('express');
const router = express.Router(); // Χρήση του router αντί του app
const multer = require('multer');
const fs = require('fs');
const moment = require('moment');
const csv = require('csv-parser');
const os = require('os');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Αποθήκευση στο προσωρινό φάκελο του OS
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/api/admin/addpasses', upload.single('file'), async (req, res) => {
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
          // Αφαίρεση BOM και άλλων μη επιθυμητών χαρακτήρων από τα πεδία
          const cleanedRow = {};
          Object.keys(row).forEach(key => {
            const cleanedKey = key.replace(/^\ufeff/, '').trim(); // Αφαίρεση BOM και trimming
            cleanedRow[cleanedKey] = row[key].trim(); // Αφαίρεση περιττών κενών
          });
          rows.push(cleanedRow);
        })
        .on('end', () => resolve(rows))
        .on('error', (err) => reject(err));
    });

    // Μετατροπή των timestamps
    passesToInsert = csvData.map(row => {
      const timestamp = row.timestamp;

      // Έλεγχος εγκυρότητας του timestamp και μετατροπή
      const validTimestamp = moment.utc(timestamp, "YYYY-MM-DD HH:mm", true).isValid()
        ? moment.utc(timestamp, "YYYY-MM-DD HH:mm").toISOString()
        : null;

      if (!validTimestamp) {
        console.warn(`Invalid timestamp found: ${timestamp}`);
        return null; // Αγνοούμε τη γραμμή αν το timestamp είναι μη έγκυρο
      }

      return {
        timestamp: validTimestamp,
        tollID: row.tollID,
        tagRef: row.tagRef || '',
        tagHomeID: row.tagHomeID || '',
        charge: parseFloat(row.charge)
      };
    }).filter(pass => pass !== null); // Φιλτράρουμε τις γραμμές με μη έγκυρα timestamps

    // Εκτύπωση των πρώτων 2 εγγραφών για έλεγχο
    for (let i = 0; i < 2; i++) {
      console.log("passesToInsert Timestamp", passesToInsert[i]?.timestamp);
    }

    // Φιλτράρουμε εγγραφές που ήδη υπάρχουν στη βάση
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

    passesToInsert = passesToInsert.filter(pass =>
      !existingSet.has(`${pass.tollID}_${pass.timestamp}_${pass.tagRef}_${pass.tagHomeID}_${pass.charge}`)
    );

    // Αν υπάρχουν νέες εγγραφές, τις αποθηκεύουμε
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
    // Διαγραφή του προσωρινού αρχείου
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });
  }
});


module.exports = router;