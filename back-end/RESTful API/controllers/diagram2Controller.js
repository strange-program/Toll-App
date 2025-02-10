const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');
const moment = require('moment');


const Diagram2= async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Εξασφαλίζουμε ότι υπάρχουν οι παράμετροι startDate και endDate
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Both startDate and endDate are required.' });
      }
  
      // Βρίσκουμε όλους τους operator που υπάρχουν στα toll stations
      const tollStations = await TollStation.find({});
      const operatorMap = tollStations.reduce((map, station) => {
        map[station.TollID] = station.Operator;
        return map;
      }, {});
  
      // Βρίσκουμε τις διελεύσεις (Passes) στο διάστημα startDate και endDate
      const passes = await Pass.find({
        timestamp: { $gte: startDate, $lte: endDate }
      });
    //console.log(passes);
      // Υπολογισμός του πλήθους των διελεύσεων ανά operator
      const operatorStats = {};
      passes.forEach(pass => {
        const operator = operatorMap[pass.tollID];
        if (operator) {
          if (!operatorStats[operator]) {
            operatorStats[operator] = 0;
          }
          operatorStats[operator]++;
        }
      });
      console.log("length of passe",passes.length);
  console.log("Διελεύσεις ανά operator",operatorStats);
      // Δημιουργούμε το αποτέλεσμα σε μορφή [{ name: "operator1", y: 2 }, { name: "operator2", y: 31 }]
      const result = Object.keys(operatorStats).map(operator => ({
        name: operator,
        y: operatorStats[operator]
      }));
  
      // Επιστρέφουμε το αποτέλεσμα
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
  };

    
  module.exports = { Diagram2 };