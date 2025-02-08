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

// API endpoint to analyze passes for a specific toll station using the tollID (stationOpID)
app.get('/api/passAnalysis/:stationOpID', async (req, res) => {
    try {
        const { stationOpID } = req.params;

        console.log(`Analyzing passes for toll station with tollID: ${stationOpID}`);

        // Step 1: Fetch all passes for the specific toll station (using the tollID)
        const passes = await Pass.find({ tollID: stationOpID });

        if (passes.length === 0) {
            console.log(`No passes found for toll station with tollID: ${stationOpID}`);
            return res.status(204).send(); // No content
        }

        // Step 2: Perform analysis
        const analysisResults = {
            totalPasses: passes.length,
            totalCharge: passes.reduce((sum, pass) => sum + pass.charge, 0),
        averageCharge: (passes.reduce((sum, pass) => sum + pass.charge, 0) / passes.length).toFixed(2),
        };

        console.log('Pass analysis completed successfully');
        res.status(200).json({
            analysisResults,
            passes, // Return the passes along with analysis results
        });
    } catch (error) {
        console.error('Error during pass analysis:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// API endpoint to get all TollStations
app.get('/api/tollStations', async (req, res) => {
    try {
        const tollStations = await TollStation.find();
        if (tollStations.length === 0) {
            console.log('No toll stations found');
            return res.status(204).send(); // No content
        }
        console.log('Toll stations fetched successfully');
        res.status(200).json(tollStations); // OK
    } catch (error) {
        console.error('Error fetching toll stations:', error);
        res.status(500).json({ message: 'Internal server error' }); // Server error
    }
});

// API endpoint to insert a new TollStation
app.post('/api/tollStations', async (req, res) => {
    try {
        const { OpID, Operator, TollID, Name, PM, Locality, Road, Lat, Long, Email, Price1, Price2, Price3, Price4 } = req.body;

        if (!OpID || !Operator || !TollID || !Name || !PM || !Locality || !Road || !Lat || !Long || !Email || !Price1 || !Price2 || !Price3 || !Price4) {
            console.log('Bad request: Missing required fields');
            return res.status(400).json({ message: 'Bad request: Missing required fields' }); // Bad request
        }

        const newTollStation = new TollStation(req.body);
        await newTollStation.save();
        console.log('Toll station added successfully');
        res.status(201).json({ message: 'Toll station added successfully', tollStation: newTollStation }); // Created
    } catch (error) {
        console.error('Error adding toll station:', error);
        res.status(500).json({ message: 'Internal server error' }); // Server error
    }
});

// API endpoint to get all Passes
app.get('/api/tollStationPasses', async (req, res) => {
    try {
        const passes = await Pass.find();
        if (passes.length === 0) {
            console.log('No passes found');
            return res.status(204).send(); // No content
        }
        console.log('Passes fetched successfully');
        res.status(200).json(passes); // OK
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({ message: 'Internal server error' }); // Server error
    }
});

// API endpoint to get passes for a specific toll station
app.get('/api/tollStationPasses/:tollStationID', async (req, res) => {
    try {
        const { tollStationID } = req.params;

        const passes = await Pass.find({ tollID: tollStationID }).sort({ timestamp: 1 });
        if (passes.length === 0) {
            console.log(`No passes found for toll station ID: ${tollStationID}`);
            return res.status(204).send(); // No content
        }

        console.log(`Passes fetched for toll station ID: ${tollStationID}`);
        res.status(200).json(passes); // OK
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({ message: 'Internal server error' }); // Server error
    }
});

// API endpoint to get passes for a specific toll station with a date filter (from date)
app.get('/api/tollStationPasses/:tollStationID/:date_from', async (req, res) => {
    try {
        const { tollStationID, date_from } = req.params;

        // Validate date_from format (expecting yyyymmdd)
        if (!/^\d{8}$/.test(date_from)) {
            console.log('Invalid date format');
            return res.status(400).json({ message: 'Invalid date format. Please use yyyymmdd (e.g., 20250208)' }); // Bad request
        }

        const startDateNumeric = parseInt(date_from, 10);
        console.log(`Fetching passes for TollStationID: ${tollStationID}, Date from: ${startDateNumeric}`);

        const passes = await Pass.find({ tollID: tollStationID });

        // Convert all stored timestamps into yyyymmdd format
        const filteredPasses = passes
        .map(pass => {
            let formattedTimestamp;

            if (typeof pass.timestamp === 'string' && /^\d{8}$/.test(pass.timestamp)) {
                // Already in yyyymmdd format as a string
                formattedTimestamp = parseInt(pass.timestamp, 10);
            } else if (pass.timestamp instanceof Date) {
                // Convert Date object to yyyymmdd
                const year = pass.timestamp.getUTCFullYear();
                const month = String(pass.timestamp.getUTCMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
                const day = String(pass.timestamp.getUTCDate()).padStart(2, '0'); // Ensure 2-digit day
                formattedTimestamp = parseInt(`${year}${month}${day}`, 10);
            } else {
                // Skip invalid timestamps
                return null;
            }

            // Just return the pass data without adding the formattedTimestamp
            return pass.toObject(); // Return only the pass data, without `formattedTimestamp`
        })
        .filter(pass => {
            const year = pass.timestamp.getUTCFullYear();
            const month = String(pass.timestamp.getUTCMonth() + 1).padStart(2, '0');
            const day = String(pass.timestamp.getUTCDate()).padStart(2, '0');
            const formattedTimestamp = parseInt(`${year}${month}${day}`, 10);
            return formattedTimestamp >= startDateNumeric;
        })
        .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp

        if (filteredPasses.length === 0) {
            console.log('No passes found after date filter');
            return res.status(204).send(); // No content
        }

        console.log(`Filtered passes fetched for toll station ID: ${tollStationID}`);
        res.status(200).json(filteredPasses); // OK
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({ message: 'Internal server error' }); // Server error
    }
});

// API endpoint to get passes for a specific toll station with a date filter (from date to date)
app.get('/api/tollStationPasses/:tollStationID/:date_from/:date_to', async (req, res) => {
    try {
        const { tollStationID, date_from, date_to } = req.params;

        // Validate date_from and date_to format (expecting yyyymmdd)
        if (!/^\d{8}$/.test(date_from) || !/^\d{8}$/.test(date_to)) {
            console.log('Invalid date format');
            return res.status(400).json({ message: 'Invalid date format. Please use yyyymmdd (e.g., 20250208)' }); // Bad request
        }

        const startDateNumeric = parseInt(date_from, 10);
        const endDateNumeric = parseInt(date_to, 10);

        // Check if startDate is greater than endDate
        if (startDateNumeric > endDateNumeric) {
            console.log('Invalid date range: start date cannot be later than end date');
            return res.status(400).json({ message: 'Invalid date range: start date cannot be later than end date' }); // Bad request
        }

        console.log(`Fetching passes for TollStationID: ${tollStationID}, Date range: ${startDateNumeric} to ${endDateNumeric}`);

        const passes = await Pass.find({ tollID: tollStationID });

        // Convert all stored timestamps into yyyymmdd format and filter within date range
        const filteredPasses = passes
        .map(pass => {
            let formattedTimestamp;

            if (typeof pass.timestamp === 'string' && /^\d{8}$/.test(pass.timestamp)) {
                // Already in yyyymmdd format as a string
                formattedTimestamp = parseInt(pass.timestamp, 10);
            } else if (pass.timestamp instanceof Date) {
                // Convert Date object to yyyymmdd
                const year = pass.timestamp.getUTCFullYear();
                const month = String(pass.timestamp.getUTCMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
                const day = String(pass.timestamp.getUTCDate()).padStart(2, '0'); // Ensure 2-digit day
                formattedTimestamp = parseInt(`${year}${month}${day}`, 10);
            } else {
                // Skip invalid timestamps
                return null;
            }

            // Just return the pass data without adding the formattedTimestamp
            return pass.toObject(); // Return only the pass data, without `formattedTimestamp`
        })
        .filter(pass => {
            const year = pass.timestamp.getUTCFullYear();
            const month = String(pass.timestamp.getUTCMonth() + 1).padStart(2, '0');
            const day = String(pass.timestamp.getUTCDate()).padStart(2, '0');
            const formattedTimestamp = parseInt(`${year}${month}${day}`, 10);
            return formattedTimestamp >= startDateNumeric && formattedTimestamp <= endDateNumeric;
        })
        .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp

        if (filteredPasses.length === 0) {
            console.log('No passes found after date filter');
            return res.status(204).send(); // No content
        }

        console.log(`Filtered passes fetched for toll station ID: ${tollStationID}`);
        res.status(200).json(filteredPasses); // OK
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({ message: 'Internal server error' }); // Server error
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

// API endpoint to reset toll stations
app.post('/api/admin/resetstations', async (req, res) => {
    try {
        // Path to the CSV file (make sure it's in the correct folder)
        const csvFilePath = './data/tollstations2024.csv'; // Adjust the path if necessary

        const tollStationsData = [];

        // Parse the CSV file
        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            tollStationsData.push(row);
        })
        .on('end', async () => {
            try {
                // Step 1: Clear existing toll stations in the database
                await TollStation.deleteMany();

                // Step 2: Insert new toll stations from the CSV
                const newTollStations = await TollStation.insertMany(tollStationsData);

                // If everything went well, return success response
                res.status(200).json({ status: 'OK' });
            } catch (err) {
                console.error('Error inserting toll stations:', err);
                res.status(500).json({ status: 'failed', info: 'Failed to insert toll stations into the database.' });
            }
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
            res.status(500).json({ status: 'failed', info: 'Error reading the CSV file.' });
        });
    } catch (error) {
        console.error('Error processing reset stations request:', error);
        res.status(500).json({ status: 'failed', info: 'Failed to process the reset stations request.' });
    }
});


// Set up a port for the API to listen on
const port = 9115;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}🚀`);
});

