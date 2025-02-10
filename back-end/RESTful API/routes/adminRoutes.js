const express = require('express');
const { upload } = require('../utils/new_upload');
const router = express.Router();

const { healthCheck } = require('../controllers/healthcheckController');
router.get('/healthcheck', healthCheck);

const { resetstations } = require('../controllers/resetstationsController');
router.get('/resetstations', resetstations);

const { resetpasses } = require('../controllers/resetpassesController');
router.get('/resetpasses', resetpasses);

const { addPasses } = require('../controllers/addPassesController_new');
router.post('/addpasses', upload.single('file'),addPasses);

module.exports = router;
