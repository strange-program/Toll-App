const express = require("express");
const { registerAdmin } = require("../controllers/registerController");
const {authenticateTokenAdmin}=require('../utils/authentication_admin_util');

const router = express.Router();

router.post("/api/admin/register", authenticateTokenAdmin,registerAdmin);

module.exports = router;
