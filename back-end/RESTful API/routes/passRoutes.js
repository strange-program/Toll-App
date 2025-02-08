const express = require('express');
const { getPassesForTollStation } = require('../controllers/passController');
const router = express.Router();

router.get('/:tollStationID/:date_from/:date_to', getPassesForTollStation);

module.exports = router;
