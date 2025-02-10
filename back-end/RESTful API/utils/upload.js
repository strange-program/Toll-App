const fs = require('fs');
const moment = require('moment');
const csv = require('csv-parser');
const os = require('os');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Save to OS temporary directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = {upload};
