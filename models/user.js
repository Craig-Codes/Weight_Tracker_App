const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

//Embedded Schema
var weightSchema = new mongoose.Schema({
  weight: Number,
  date: Date,
  comment: String,
});

// Main Schema
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  age: Number,
  gender: String,
  heightFt: Number,
  heightIn: Number,
  weight: Number,
  weights: [weightSchema], // array of weight input data
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
