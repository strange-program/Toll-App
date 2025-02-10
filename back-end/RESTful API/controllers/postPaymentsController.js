const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "your_secret_key"; // Αντικατέστησέ το με ένα πιο ασφαλές κλειδί

const postPaymentController=async (req, res) => {
console.log("New payment");
    const token = req.header("X-OBSERVATORY-AUTH");
    
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
          const verified = jwt.verify(token, "your_secret_key"); // Επαλήθευση του JWT
                 req.user = verified; 
         
                 let tollOpID = req.user.tollOpID; // Ανάκτηση του tollOpID από το token
      
                 try {
                    const operators = new Set(['AM', 'EG', 'GE', 'KO', 'MO', 'NAO', 'NO', 'OO'])
                    if(!(operators.has(tollOpID))) {
                        return res.status(400).json({ message: 'Invalid Toll Operator ID: no operator with that ID' });
                    }
                
                    const Map = new Object();
                    Map.aegeanmotorway='AM';
                    Map.egnatia='EG';
                    Map.gefyra='GE';
                    Map.kentrikiodos='KO';
                    Map.moreas='MO';
                    Map.naodos='NAO';
                    Map.neaodos='NO';
                    Map.olympiaodos='OO';

                  const  { company, money } =req.body;
                   
                  let Pay_to_OpID=company.split(",");

                for(let i=0; i<Pay_to_OpID.length;i++) 
                    
                    {  Pay_to_OpID[i]=Map[Pay_to_OpID[i]];

                        if (!Pay_to_OpID[i]) {
                            console.error("Invalid company name:", Pay_to_OpID[i]);
                          }
                          
                    }
                  

               console.log("Operator payed:",Pay_to_OpID); // 


                   //query που να βρίσκει όλα τα non payed passes με tgHomeID=tollOpID και tollID ανήκει στο Pay_to_OpID 
                                  //και  όλα τα payed passes με tgHomeID=Pay_to_OpID και tollId ανήκει στον tollOpID

                                  const queryResult = await Pass.updateMany(
                                    {
                                        $or: [
                                            { //Οφειλές του Pay_to_OpID στον tollOpID
                                                tollID: { $regex: `^${tollOpID}` },
                                                tagHomeID: { $in: Pay_to_OpID },  // Ελέγχει αν το tagHomeID είναι στο Pay_to_OpID
                                                isPayed: { $ne: true }
                                            },
                                            {  //Οφειλές του tollOpID στον Pay_to_OpID
                                                isPayed: { $ne: true },
                                                tagHomeID: tollOpID,
                                                $or: Pay_to_OpID.map(id => ({
                                                    tollID: { $regex: `^${id}` }
                                                })) //Ελέγχει αν το tollID ξεκινάει από κάποιο στοιχείο του Pay_to_OpID
                                            }
                                        ]
                                    },
                                    {
                                        $set: { isPayed: true }
                                    }
                                );
                                
                                
                    console.log("Print queryResult.Post Payment");
                    console.log(queryResult);
                    res.sendStatus(200); 



                
                }  catch (error) {
                    console.error('Error fetching toll station passes:', error);
                    res.status(500).json({ message: 'Internal server error' });
                } 


    }

    catch (err) {
        return res.status(400).json({ error: "Invalid Token" });
    }




};



module.exports = { postPaymentController };