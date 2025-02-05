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


app.get("/api/getAmountsDue", async (req, res) => {
  //return res.status(401).json({ message: "Invalid password" });
  res.json([{label:"A",value:"1"},{label:"B",value:"0"},{label:"Γ",value:"-1"},{label:"D",value:"-2"},{label:"A",value:"1"},{label:"B",value:"2"},{label:"Γ",value:"-1"},{label:"D",value:"-2"}])
});

app.post("/api/postPayment", async (req, res) => {
//console.log("Ok");
  res.json({ message:"ok"});
});


app.get("/api/getDiagram2", async (req, res) => {
  //return res.status(401).json({ message: "Invalid password" });
  res.json([ { name: "aegean", y: 45},
    { name: "olympia", y: 30},
    { name: "neaodos", y: 60},])
});

app.get("/api/getDiagram1", async (req, res) => {
  //return res.status(401).json({ message: "Invalid password" });
  console.log("Server call");
  res.json([ { date: "2024-01-01", value: 45 ,Price1:20, Price2:20, Price3:2 , Price4:3},
    {  date: "2024-01-02", value: 30 ,Price1:20, Price2:3, Price3:3 , Price4:4},
    { date: "2024-01-03", value: 60 ,Price1:10, Price2:30, Price3:10 , Price4:10},])
});

app.listen(9115, () => console.log("Server running on port 9115"));
