
     const jwt = require("jsonwebtoken");
     const {tokenBlacklist}=require("./authentication_utils.js");   
      
        
        const authenticateTokenAdmin = (req, res, next) => {
            const token = req.headers["x-observatory-auth"]; // Παίρνουμε το token από το request header
        
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }
        
            if (tokenBlacklist.has(token)) {
                return res.status(403).json({ message: "Token is invalid (Logged out)." });
            }
        
            try {
                const decoded = jwt.verify(token, "your_secret_key"); // Επαλήθευση του token
                if(decoded.username != "admin1") return res.status(401).json({ message: "Access denied. Only admin is permitted" });
                req.user = decoded; // Αποθηκεύουμε τα στοιχεία του χρήστη στο request
                next(); // Συνεχίζουμε στο επόμενο middleware / route handler
            } catch (err) {
                return res.status(403).json({ message: "Invalid token." });
            }
        };
        
        module.exports = { authenticateTokenAdmin };
