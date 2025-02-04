const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express=require("express");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "your_secret_key"; // Αντικατέστησέ το με ένα πιο ασφαλές κλειδί


app.post("/api/login", express.urlencoded({ extended: true }),async (req, res) => {
  const { username, password } = req.body;
  
  

  
  
  if (username!="Filo"){console.log('401'); return res.status(401).json({ message: "User not found" });}

  
  if (password!="ok") return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ username: {username} }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ token:token});
});

app.post("/api/logout", async (req, res) => {

  res.json({ message:"ok"});
});

app.get("/api/paymentsfrequency", async (req, res) => {

  res.json([{ label:"A" ,value:"10"},{label:"B",value:"20"}]);
});
/*
app.post("/api/login", express.urlencoded({ extended: true }), async (req, res) => {
  console.log(req.body); // Εκτυπώνει τι λαμβάνει ο server
  res.json({ message: "Received", data: req.body });
});*/

app.get("/api/passes", async (req, res) => {

  res.json({passes:"1"})
});

app.listen(9115, () => console.log("Server running on port 9115"));
