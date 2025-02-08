// server.js
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db');  // Import the connectDB function

// Import route files
const tollStationRoutes = require('./routes/tollStationRoutes');
const passRoutes = require('./routes/passRoutes');
const passRoutesSimple = require('./routes/passRoutesSimple');
const healthCheckRoutes = require('./routes/healthCheckRoutes');

// Initialize Express app
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Connect to MongoDB
connectDB();  // Call the connectDB function to establish the connection

// Define routes
app.use('/api/tollStations', tollStationRoutes);
app.use('/api/tollStationPasses', passRoutes);
app.use('/api/tollStationPasses', passRoutesSimple);
app.use('/api/admin', healthCheckRoutes);

// Set up a port for the API to listen on
const port = 9115;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}🚀`);
});
