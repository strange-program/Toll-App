const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/TollDatabase';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB🔗');
    } catch (err) {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1);  // Exit the application in case of MongoDB connection failure
    }
};

module.exports = connectDB;  // Export the connectDB function