const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "your_secret_key"; // Αντικατέστησέ το με ένα πιο ασφαλές κλειδί

mongoose.connect("mongodb://localhost:27017/mydb", { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ token, user: { email: user.email } });
});

app.listen(5000, () => console.log("Server running on port 5000"));
