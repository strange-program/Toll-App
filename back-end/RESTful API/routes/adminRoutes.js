const express = require('express');
const multer = require('multer');
const { upload } = require('../utils/upload');
const router = express.Router();

const { healthCheck } = require('../controllers/healthcheckController');
router.get('/healthcheck', healthCheck);

const { resetstations } = require('../controllers/resetstationsController');
router.get('/resetstations', resetstations);

const { resetpasses } = require('../controllers/resetpassesController');
router.get('/resetpasses', resetpasses);

const { addPasses } = require('../controllers/addPassesController');
router.post('/addpasses', upload.single('file'),addPasses);

const { getUsers } = require('../controllers/getUsersController');
router.get('/getUsers', getUsers);

module.exports = router;
