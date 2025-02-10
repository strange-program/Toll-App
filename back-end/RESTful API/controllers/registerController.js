const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.registerAdmin = async (req, res) => {
    const { username, password,OpID } = req.body;

    console.log(username);
    console.log(password);
    console.log("Operator ID",OpID);
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user
        const newUser = new User({
            username,
            password: hashedPassword,
             tollOpID:OpID
        });

        await newUser.save(); // Save user to database
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error: error.message });
    }
};
