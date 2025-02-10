const express = require('express');
const { getTollMapPasses } = require('../controllers/TollMapPassesController');
const router = express.Router();

router.get('/api/passes',getTollMapPasses );

module.exports = router;