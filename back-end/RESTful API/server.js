// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');

// Initialize Express app
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// MongoDB connection string (replace with your connection string)
const mongoURI = 'mongodb://localhost:27017/TollDatabase'; // For local MongoDB

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB🔗');
})
.catch((err) => {
    console.log('Error connecting to MongoDB:', err);
    process.exit(1);  // Exit the application in case of MongoDB connection failure
});

// Define a Schema for the Passes collection based on your data
const passSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    tollID: { type: String, required: true },
    tagRef: { type: String, required: true },
    tagHomeID: { type: String, required: true },
    charge: { type: Number, required: true },
});

// Create a model based on the schema and specify the collection name
const Pass = mongoose.model('Pass', passSchema, 'Passes');

// **NEW** Schema for TollStations
const tollStationSchema = new mongoose.Schema({
    OpID: { type: String, required: true },
    Operator: { type: String, required: true },
    TollID: { type: String, required: true },
    Name: { type: String, required: true },
    PM: { type: String, required: true },
    Locality: { type: String, required: true },
    Road: { type: String, required: true },
    Lat: { type: Number, required: true },
    Long: { type: Number, required: true },
    Email: { type: String, required: true },
    Price1: { type: Number, required: true },
    Price2: { type: Number, required: true },
    Price3: { type: Number, required: true },
    Price4: { type: Number, required: true },
});

const TollStation = mongoose.model('TollStation', tollStationSchema, 'Tolls');

function convertDateFormat(dateString) {
    if (!/^\d{8}$/.test(dateString)) {
        throw new Error("Invalid date format. Please provide a date in YYYYMMDD format.");
    }

    const year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6) - 1;  // Month is 0-based in JavaScript Date
    let day = parseInt(dateString.substring(6, 8), 10);

    // Add 1 to the day
    day += 1;

    // Create the new date
    const date = new Date(year, month, day);

    // Return the ISO 8601 format: "2022-01-09T15:26:00.000Z"
    return date.toISOString();
}

// API endpoint to get passes for a specific toll station with a date range filter
app.get('/api/tollStationPasses/:tollStationID/:date_from/:date_to', async (req, res) => {
    try {
        const { tollStationID, date_from, date_to } = req.params;

        // Validate date format (expecting yyyymmdd)
        if (!/^\d{8}$/.test(date_from) || !/^\d{8}$/.test(date_to)) {
            return res.status(400).json({ message: 'Invalid date format. Please use yyyymmdd (e.g., 20250208)' });
        }

        const startDateNumeric = parseInt(date_from, 10);
        const endDateNumeric = parseInt(date_to, 10);

        if (startDateNumeric > endDateNumeric) {
            return res.status(400).json({ message: 'Invalid date range: start date cannot be later than end date' });
        }

        // Fetch toll station info from the database
        const tollStation = await TollStation.findOne({ TollID: tollStationID });
        if (!tollStation) {
            return res.status(404).json({ message: 'Toll station not found' });
        }

        // Fetch passes for the specified toll station
        const passes = await Pass.find({ tollID: tollStationID });

        // Convert and filter passes based on date range
        const filteredPasses = passes
        .map(pass => {
            const formattedTimestamp = pass.timestamp instanceof Date
            ? parseInt(`${pass.timestamp.getUTCFullYear()}${String(pass.timestamp.getUTCMonth() + 1).padStart(2, '0')}${String(pass.timestamp.getUTCDate()).padStart(2, '0')}`, 10)
            : null;

            if (formattedTimestamp && formattedTimestamp >= startDateNumeric && formattedTimestamp <= endDateNumeric) {
                return pass;
            }
            return null;
        })
        .filter(pass => pass !== null)
        .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp

        if (filteredPasses.length === 0) {
            return res.status(204).send(); // No content
        }

        const analysis = {
            stationID: tollStation.TollID,
            stationOperator: tollStation.Operator,
            requestTimestamp: new Date().toISOString(),
        periodFrom: convertDateFormat(date_from),  // Human-readable format for periodFrom
        periodTo: convertDateFormat(date_to),      // Human-readable format for periodTo
        nPasses: filteredPasses.length,
        passList: filteredPasses.map((pass, index) => ({
            passIndex: index + 1,
            passID: pass._id,
            timestamp: pass.timestamp,
            tagID: pass.tagRef,
            tagProvider: pass.tagHomeID,  // Assuming tagHomeID is the tag provider
            passType: pass.tagHomeID === tollStation.OpID ? 'home' : 'visitor',  // Assuming tagHomeID refers to "home" type
            passCharge: pass.charge
        }))
        };

        res.status(200).json(analysis);
    } catch (error) {
        console.error('Error fetching toll station passes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// API endpoint to perform a health check and verify DB connectivity
app.get('/api/admin/healthcheck', async (req, res) => {
    try {
        // Check if MongoDB is connected
        const isConnected = mongoose.connection.readyState === 1;

        // Retrieve counts of documents in the collections (toll stations, passes, and tags)
        const n_stations = await TollStation.countDocuments();
        const n_tags = await Pass.distinct('tagRef').countDocuments();  // Assuming 'tagRef' represents the tags
        const n_passes = await Pass.countDocuments();

        // Get the connection string (we'll return a simplified string for display purposes)
        const dbconnection = mongoURI;

        if (isConnected) {
            console.log('Healthcheck: Connection is OK');

            // Return a 200 status with the healthcheck info
            return res.status(200).json({
                status: 'OK',
                dbconnection: dbconnection,
                n_stations: n_stations,
                n_tags: n_tags,
                n_passes: n_passes,
            });
        } else {
            console.log('Healthcheck: Database connection failed');

            // Return a 401 status with the failed connection info
            return res.status(401).json({
                status: 'failed',
                dbconnection: dbconnection,
            });
        }
    } catch (error) {
        console.error('Error during healthcheck:', error);

        // Return a 401 status in case of unexpected errors
        return res.status(401).json({
            status: 'failed',
            dbconnection: mongoURI,
        });
    }
});

// Set up a port for the API to listen on
const port = 9115;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}🚀`);
});
