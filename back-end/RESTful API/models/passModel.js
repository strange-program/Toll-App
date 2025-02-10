const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    timestamp: { type: String, required: true },
    tollID: { type: String, required: true },
    tagRef: { type: String, required: true },
    tagHomeID: { type: String, required: true },
    charge: { type: Number, required: true },
    isPayed: { type: Boolean, default: false },
}, { versionKey: false });

const Pass = mongoose.model('Pass', passSchema, 'Passes');

module.exports = Pass;
