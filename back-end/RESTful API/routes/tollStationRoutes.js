const express = require('express');
const { getAllTollStations } = require('../controllers/tollStationController');
const router = express.Router();

router.get('/', getAllTollStations);

module.exports = router;
