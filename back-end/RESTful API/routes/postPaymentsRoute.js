const { postPaymentController } = require('../controllers/postPaymentsController');
const express = require('express');
const router = express.Router();

router.post('/api/postPayment', postPaymentController);

module.exports = router;