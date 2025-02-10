const Pass = require('../models/passModel');

const getAllPasses = async (req, res) => {
    try {
        const passes = await Pass.find(); // Fetch all passes
        if (passes.length === 0) {
            return res.status(204).send(); // No content if no passes are found
        }
        console.log('Passes fetched successfully');
        return res.status(200).json(passes); // Return passes with a 200 OK status
    } catch (error) {
        console.error('Error fetching passes:', error);
        return res.status(500).json({ message: 'Internal server error' }); // Return server error if fetching fails
    }
};

module.exports = { getAllPasses };
