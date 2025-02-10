const mongoose = require('mongoose');
const TollStation = require('../models/tollStationModel');
const Pass = require('../models/passModel');
const User = require('../models/userModel');
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key"; // Αντικατέστησέ το με ένα πιο ασφαλές κλειδί

router.post("/api/login", express.urlencoded({ extended: true }), async (req, res) => {
    const { username, password } = req.body;
    console.log("username",username);
    console.log("password",password);
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) return res.status(401).json({ message: "User not found" });
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid password" });
  
    const token = jwt.sign({ username: user.username , tollOpID:user.tollOpID }, SECRET_KEY, { expiresIn: "1h" });
  
    res.json({ token, token });
  });

  
module.exports = router;
