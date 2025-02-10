const jwt = require("jsonwebtoken");

// Δημιουργούμε ένα global Set για τα blacklisted tokens
const tokenBlacklist = new Set();

const authenticateToken = (req, res, next) => {
    const token = req.headers["x-observatory-auth"]; // Παίρνουμε το token από το request header

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    if (tokenBlacklist.has(token)) {
        return res.status(403).json({ message: "Token is invalid (Logged out)." });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key"); // Επαλήθευση του token
        req.user = decoded; // Αποθηκεύουμε τα στοιχεία του χρήστη στο request
        next(); // Συνεχίζουμε στο επόμενο middleware / route handler
    } catch (err) {
        return res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = { authenticateToken, tokenBlacklist };
