const { paymentController } = require('../controllers/paymentsController');
const {authenticateToken}=require('../utils/authentication_utils');
const express = require('express');
const router = express.Router();

router.get('/api/getAmountsDue', authenticateToken,paymentController);

module.exports = router;
