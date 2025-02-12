const { authenticateToken, tokenBlacklist } = require('../utils/authentication_utils');
const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');
const User = require('../models/userModel');
const moment = require('moment');



const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; 


router.post("/api/logout",authenticateToken ,(req, res) => {
    try {
        const token = req.headers["x-observatory-auth"]; // Διαβάζουμε το token από το σωστό header
    
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }
    
        try {
            const decoded = jwt.verify(token, "your_secret_key");
            tokenBlacklist.add(token); // Προαιρετικά, μπλοκάρουμε το token
            return res.status(200).json({});
        } catch (err) {console.log(err.message);
            return res.status(401).json({ message: "Invalid token" });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports=router;
