const express = require('express');
const { getAllTollStations } = require('../controllers/tollStationController');
const router = express.Router();
const { authenticateToken, tokenBlacklist } = require('../utils/authentication_utils');

router.get('/',authenticateToken, getAllTollStations);

module.exports = router;
