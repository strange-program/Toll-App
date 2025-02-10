const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');
const moment = require('moment');


const Diagram1=async (req, res) => {
    try {
      const { operator,startDate, endDate } = req.query;
  
       console.log("Operator",operator);
  
       console.log("startDate",startDate);
  
       console.log("endDate",endDate);
      // Έλεγχος για τις απαιτούμενες παραμέτρους
      if (!startDate || !endDate || !operator) {
        return res.status(400).json({ error: 'startDate, endDate, and operator are required.' });
      }
  
      // Βρίσκουμε όλους τους σταθμούς που ανήκουν στον συγκεκριμένο operator
      const tollStations = await TollStation.find({ Operator: operator });
     
  
      if (!tollStations.length) {
        return res.status(404).json({ error: 'Operator not found or has no toll stations.' });
      }
  
      // Λίστα με όλα τα TollID που ανήκουν στον Operator
      const tollIDs = tollStations.map(station => station.TollID);
  
      console.log("Toll ID's");
      console.log(tollIDs);
  
      // Δημιουργούμε ένα map που αντιστοιχεί κάθε TollID στις τιμές Price1, Price2, Price3, Price4
      const tollPriceMap = tollStations.reduce((map, station) => {
        map[station.TollID] = {
          Price1: station.Price1,
          Price2: station.Price2,
          Price3: station.Price3,
          Price4: station.Price4
        };
        return map;
      }, {});
      console.log("toll proce map");
      console.log(tollPriceMap);
  
  
  
      // Βρίσκουμε όλες τις διελεύσεις που έγιναν στα συγκεκριμένα TollID και στο χρονικό διάστημα
      const passes = await Pass.find({
        timestamp: { $gte: startDate, $lte: endDate },
        tollID: { $in: tollIDs }
      });
    
      // Ομαδοποίηση διελεύσεων ανά ημέρα
      const dailyStats = {};
  
      passes.forEach(pass => {
        const date = moment(pass.timestamp).format('YYYY-MM-DD'); // Μορφοποίηση της ημερομηνίας
        if (!dailyStats[date]) {
          dailyStats[date] = { value: 0, Price1: 0, Price2: 0, Price3: 0, Price4: 0 };
        }
  
        dailyStats[date].value++;
  
        // Παίρνουμε τις τιμές Price για το TollID της συγκεκριμένης διέλευσης
        const prices = tollPriceMap[pass.tollID];
  
        // Ελέγχουμε ποιο Price αντιστοιχεί στη χρέωση της διέλευσης
        if (pass.charge === prices.Price1) {
          dailyStats[date].Price1++;
        } else if (pass.charge === prices.Price2) {
          dailyStats[date].Price2++;
        } else if (pass.charge === prices.Price3) {
          dailyStats[date].Price3++;
        } else if (pass.charge === prices.Price4) {
          dailyStats[date].Price4++;
        }
      });
  
      // Μετατρέπουμε το dailyStats σε πίνακα αντικειμένων
      const result = Object.keys(dailyStats).map(date => ({
        date: date,
        value: dailyStats[date].value,
        Price1: dailyStats[date].Price1,
        Price2: dailyStats[date].Price2,
        Price3: dailyStats[date].Price3,
        Price4: dailyStats[date].Price4
      }));
  
      console.log(result);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
  }
  
  module.exports = { Diagram1 };