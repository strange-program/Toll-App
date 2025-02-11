const express = require('express');
const multer = require('multer');
const { upload } = require('../utils/upload');
const {authenticateTokenAdmin}=require('../utils/authentication_admin_util');
const {authenticateToken}=require('../utils/authentication_utils');
const router = express.Router();

const { healthCheck } = require('../controllers/healthcheckController');
router.post('/healthcheck', authenticateTokenAdmin,healthCheck);
router.get('/healthcheck', authenticateTokenAdmin,healthCheck);

const { resetstations } = require('../controllers/resetstationsController');
router.post('/resetstations', authenticateTokenAdmin,resetstations);

const { resetpasses } = require('../controllers/resetpassesController');
router.post('/resetpasses', authenticateTokenAdmin,resetpasses);

const { addPasses } = require('../controllers/addPassesController');
router.post('/addpasses', authenticateTokenAdmin,upload.single('file'),addPasses);


const { getUsers } = require('../controllers/getUsersController');
router.get('/getUsers', authenticateTokenAdmin ,getUsers);

module.exports = router;
