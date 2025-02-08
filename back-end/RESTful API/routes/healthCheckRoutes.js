const express = require('express');
const { healthCheck } = require('../controllers/healthCheckController');
const router = express.Router();

router.get('/healthcheck', healthCheck);

module.exports = router;
