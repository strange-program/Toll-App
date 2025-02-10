const express = require('express');
const { getAllPasses } = require('../controllers/passControllerSimple');
const router = express.Router();

// Route to fetch all passes
router.get('/', getAllPasses);

module.exports = router;
