require('dotenv').config({path: '../../config.env'});
const express = require('express');
const connectDB = require('./db');  // Import the connectDB function
const cors = require("cors");

// Import route files
const functionalRoutes = require('./routes/functionalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tollStationRoutes = require('./routes/tollStationRoutes');
const passRoutesSimple = require('./routes/passRoutesSimple');
const tollMapRoutes = require('./routes/TollMapRoutes');
const logoutRoute=require('./routes/logoutRoute');
const loginRoute=require('./routes/loginRoute');
const diagram1Route=require('./routes/diagram1Route');
const diagram2Route=require('./routes/diagram2Route');
const registerRoute=require('./routes/registerRoutes');
const paymentsRoute=require('./routes/paymentRoute');
const postPaymentRoute=require('./routes/postPaymentsRoute.js');

// Initialize Express app
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();  // Call the connectDB function to establish the connection

// Define Functional Endpoint routes
app.use('/api', functionalRoutes)
// Define Admin Endpoint routes 
app.use('/api/admin', adminRoutes);

app.use('/api/tollStations', tollStationRoutes);
app.use('/api/tollStationPasses', passRoutesSimple);
app.use(tollMapRoutes);  //api/passes 
app.use(loginRoute);      //api/login     
app.use(logoutRoute);     //api/logout 
app.use(diagram1Route);      //api/getDiagram1     
app.use(diagram2Route);     //api/getDiagram2
app.use(registerRoute);     //api/register  //εγγραφή χρηστών για testing
app.use(paymentsRoute);  //api/payments
app.use(postPaymentRoute); //api/postPayment


// Set up a port for the API to listen on
const port = 9115;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}🚀`);
});
