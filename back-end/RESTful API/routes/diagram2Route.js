const { Diagram2 } = require('../controllers/diagram2Controller');
const express = require('express');
const router = express.Router();

router.get('/api/getDiagram2', Diagram2);

module.exports = router;
