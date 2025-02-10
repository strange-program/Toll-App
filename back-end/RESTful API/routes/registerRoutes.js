const express = require("express");
const { registerAdmin } = require("../controllers/registerController");

const router = express.Router();

router.post("/api/admin/register", registerAdmin);

module.exports = router;
