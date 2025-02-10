const { postPaymentController } = require('../controllers/postPaymentsController');
const {authenticateToken}=require('../utils/authentication_utils');
const express = require('express');
const router = express.Router();

router.post('/api/postPayment', authenticateToken,postPaymentController);

module.exports = router;
