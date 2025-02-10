const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');
const moment = require('moment');
const { convertDateFormat } = require('../utils/dateUtils');


const getTollMapPasses=  async (req, res) => {
  console.log("serve call");
  try {
    const { stationId, startDate, endDate } = req.query;

    console.log("stationId", stationId);
    console.log("startDate", startDate);
    console.log("endDate", endDate);

    if (!stationId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Μετατροπή της εισερχόμενης ημερομηνίας σε ISO 8601 format
    

    const startISO = moment.utc(startDate, "YYYY-MM-DD").startOf('day').toISOString();
   const endISO = moment.utc(endDate, "YYYY-MM-DD").endOf('day').toISOString();

    console.log("startISO",startISO);
    console.log("endISO",endISO);

    if (!startISO || !endISO) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Προσαρμογή του query
    const query = {
      tollID: stationId,
      timestamp: { $gte: startISO, $lte: endISO }
    };

    // Υπολογισμός του αριθμού των διελεύσεων
    const passCount = await Pass.countDocuments(query);
    console.log(passCount);

    //const passResults = await Easy_Timestamp_Pass.find(query);

  //console.log(passResults);  // Θα εκτυπώσει τα έγγραφα που ταιριάζουν με το query

    res.json({ passes: passCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  module.exports = { getTollMapPasses };
  