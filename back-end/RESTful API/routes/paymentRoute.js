const { paymentController } = require('../controllers/paymentsController');
const express = require('express');
const router = express.Router();

router.get('/api/getAmountsDue', paymentController);

module.exports = router;