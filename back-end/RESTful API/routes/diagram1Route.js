const { Diagram1 } = require('../controllers/diagram1Controller');
const express = require('express');
const router = express.Router();

router.get('/api/getDiagram1', Diagram1);

module.exports = router;
