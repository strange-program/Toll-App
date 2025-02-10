const User = require('../models/userModel');

const getUsers = async (req,res) => {
    try {
        const users = await User.find({}, "username"); // Fetch only usernames
        const usernames = users.map(user => user.username);
        res.status(200).json({ usernames });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = { getUsers };