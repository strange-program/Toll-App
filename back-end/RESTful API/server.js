// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// MongoDB connection string (replace with your connection string)
const mongoURI = 'mongodb://localhost:27017/TollDatabase'; // For local MongoDB
// For MongoDB Atlas, use your MongoDB Atlas URI here

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Error connecting to MongoDB:', err);
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

// **NEW** Schema for TollStations (from your `Tolls` folder)
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

// Create a model for the toll stations collection
const TollStation = mongoose.model('TollStation', tollStationSchema, 'Tolls');

// API endpoint to get all TollStations
app.get('/api/tollStations', async (req, res) => {
    try {
        const tollStations = await TollStation.find(); // Fetch all toll stations from the database
        console.log('Fetched toll stations:', tollStations); // Log the result to console
        res.json(tollStations);
    } catch (error) {
        console.error('Error fetching toll stations:', error);
        res.status(500).json({ message: 'Error fetching toll stations' });
    }
});

// API endpoint to insert a new TollStation
app.post('/api/tollStations', async (req, res) => {
    try {
        const { OpID, Operator, TollID, Name, PM, Locality, Road, Lat, Long, Email, Price1, Price2, Price3, Price4 } = req.body;

        // Create a new toll station document
        const newTollStation = new TollStation({
            OpID,
            Operator,
            TollID,
            Name,
            PM,
            Locality,
            Road,
            Lat,
            Long,
            Email,
            Price1,
            Price2,
            Price3,
            Price4,
        });

        // Save the document to the database
        await newTollStation.save();

        res.status(201).json({ message: 'Toll station added successfully', tollStation: newTollStation });
    } catch (error) {
        console.error('Error adding toll station:', error);
        res.status(500).json({ message: 'Error adding toll station' });
    }
});

// API endpoint to get all Passes
app.get('/api/tollStationPasses', async (req, res) => {
    try {
        const passes = await Pass.find(); // Fetch all passes from the database
        console.log('Fetched passes:', passes); // Log the result to console
        res.json(passes);
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({ message: 'Error fetching passes' });
    }
});

// Set up a port for the API to listen on (port 9115 as requested)
const port = 9115;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
