const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_secret_key"; // Αντικατέστησέ το με ένα πιο ασφαλές κλειδί

const paymentController=async (req, res) => {

    const token = req.header("X-OBSERVATORY-AUTH");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token, "your_secret_key"); // Επαλήθευση του JWT
        req.user = verified; 

        let tollOpID = req.user.tollOpID; // Ανάκτηση του tollOpID από το token

        // Εδώ μπορείς να συνεχίσεις την επεξεργασία της πληρωμής...
    
        try {
            //const _requestTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16); // date at the time of call in YYYY-MM-DD HH:MM
    
            //const { tollOpID, date_from, date_to } = req.query; // Getting the Path Parameters
            //const format = req.query.format || 'json'; // Getting the Query Parameters (default to JSON)
    
            // Validate and format date (expecting YYYYMMDD, returning YY-MM-DD hh:mm)
           
     
            const operators = new Set(['AM', 'EG', 'GE', 'KO', 'MO', 'NAO', 'NO', 'OO'])
            if(!(operators.has(tollOpID))) {
                return res.status(400).json({ message: 'Invalid Toll Operator ID: no operator with that ID' });
            }
    
    
            const queryResult = await Pass.aggregate([
                {
                    $match: { // Φιλτράρισμα με βάση την περίοδο και τον σταθμό διοδίων
                        tollID: {$regex: `^${tollOpID}`},
                        isPayed: { $ne: true } // Εξαιρεί εγγραφές όπου το isPayed είναι true
                      
                    }
                },
                {
                    $group: { // Ομαδοποίηση ανά operator
                        _id: "$tagHomeID",
                        nPasses: { $sum: 1 },
                        totalCost: { $sum: '$charge' }
                    }
                },    
                { 
                    $match: { // Φιλτράρισμα για να εξαιρέσουμε τον ίδιο τον operator
                        _id: { $ne: tollOpID }
                    }
                },
                {
                    $project: { // Διαμόρφωση του τελικού αποτελέσματος
                        _id: 0,  // Remove MongoDB's default _id field
                        visitingOpID: "$_id", // Rename _id to visitingOpID
                        nPasses: 1,
                        totalCost: 1
                    }
                }
            ])
    
           console.log("Send Payment Query results");
            console.log(queryResult);
    
       //Query για να δούμε πόσα χρωστάει ο operator με tollOpID στους υπόλοιπους.
       //Θα βρω τα passes με tagHomeID==toLllOpID και θα τα ομαδοποιήσω ανά operator
       //Αυτά είναι τα χρήματα που οφείλει ο tollOpID στους υπόλοιπους

       const queryResult2 = await Pass.aggregate([
        {
            $match: { // Φιλτράρισμα με βάση την περίοδο και τον σταθμό διοδίων
                tagHomeID: { $eq: tollOpID },
                tollID: { 
                    $not: { 
                        $regex: `^${tollOpID}` // Αποκλείει τα αποτελέσματα όπου το tollID ξεκινά με tollOpID
                    }
                },
                isPayed: { $ne: true } // Εξαιρεί εγγραφές όπου το isPayed είναι true
            }
        },
        {$addFields: {
            operatorID: {
                $let: {
                    vars: {
                        operatorPrefix: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: [...operators], // Convert the Set to an array
                                        as: "operator",
                                        cond: { 
                                            $eq: [
                                                { $substrBytes: ["$tollID", 0, { $strLenBytes: "$$operator" }] }, // Get the prefix of tollID
                                                "$$operator" // Compare with operator ID from the Set
                                            ]
                                        }
                                    }
                                },
                                0 // Get the first match, if any
                            ]
                        }
                    },
                    in: { $ifNull: ["$$operatorPrefix", "$tollID"] } // If no match, use the entire tollID
                }
            }
        }
    },
    
        {
            $group: { // Ομαδοποίηση ανά operator
                _id: "$operatorID",
                nPasses: { $sum: 1 },
                totalCost: { $sum: '$charge' } 
            }
        },    
   
        {
            $project: { // Διαμόρφωση του τελικού αποτελέσματος
                _id: 0,  // Remove MongoDB's default _id field
                visitingOpID: "$_id", // Rename _id to visitingOpID
                nPasses: 1,
                totalCost: 1
            }
        }
    ])

//console.log("QueryResult");
 //console.log(queryResult2);
            // Prepare response object
            const response = {
                tollOpID: tollOpID,
                vOpList: queryResult.map((pass) => ({
                    visitingOpID: pass.visitingOpID,
                    nPasses: pass.nPasses,
                    passesCost: pass.totalCost
                }))
            };


            const response2 = {
                tollOpID: tollOpID,
                vOpList: queryResult2.map((pass) => ({
                    visitingOpID: pass.visitingOpID,
                    nPasses: pass.nPasses,
                    passesCost: pass.totalCost
                }))
            };
        
    
     

            // Δημιουργία χαρτών για γρήγορη αναζήτηση
   const map1 = Object.fromEntries(response.vOpList.map(pass => [pass.visitingOpID, pass.passesCost]));
  const map2 = Object.fromEntries(response2.vOpList.map(pass => [pass.visitingOpID, pass.passesCost]));

  // Ενοποίηση των visitingOpID από τα δύο response
 const allVisitingOpIDs = new Set([...Object.keys(map1), ...Object.keys(map2)]);

 const allNames = new Set([...allVisitingOpIDs, ...operators]); //προσθήκη κάποιου από τους operators αν δεν υπάρχει

 const mergedResult = Array.from(allNames)
     .map(visitingOpID => ({
         label: visitingOpID,
         value:parseFloat(((map1[visitingOpID] || 0) - (map2[visitingOpID] || 0)).toFixed(2)) // Στρογγυλοποίηση στα 2 δεκαδικά
     }))
     .sort((a, b) => a.label.localeCompare(b.label)); // Ταξινόμηση αλφαβητικά
 
    // Μετατροπή σε JSON
 //const finalJSON = JSON.stringify(mergedResult);

//console.log(finalJSON);

 console.log("Send Data for Payments Page");

res.status(200).json(mergedResult);

            
          
        } catch (error) {
            console.error('Error fetching toll station passes:', error);
            res.status(500).json({ message: 'Internal server error' });
        } 




    } catch (err) {
        return res.status(400).json({ error: "Invalid Token" });
    }

};






module.exports = { paymentController };