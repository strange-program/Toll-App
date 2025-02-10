const express = require('express');
const router = express.Router();
const { authenticateToken, tokenBlacklist } = require('../utils/authentication_utils');

const { tollStationPasses } = require('../controllers/tollStationPassesController.js');
router.get('/tollStationPasses/:tollStationID/:date_from/:date_to', authenticateToken, tollStationPasses);

const { passAnalysis } = require('../controllers/passAnalysisController');
router.get('/passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to', authenticateToken, passAnalysis);

const { passesCost } = require('../controllers/passesCostController');
router.get('/passesCost/:tollOpID/:tagOpID/:date_from/:date_to', authenticateToken,passesCost);

const { chargesBy } = require('../controllers/chargesByController');
router.get('/chargesBy/:tollOpID/:date_from/:date_to', authenticateToken, chargesBy);

module.exports = router;