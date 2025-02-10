const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    tollOpID:String
  });
  
  const User = mongoose.model("User", UserSchema,"Users");



module.exports = User;
