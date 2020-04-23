const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

// Main User Schema
let userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  age: Number,
  gender: String,
  heightFt: Number,
  heightIn: Number,
  weights: [{ // Array of weights, found in the Weight Schema
    type: mongoose.Schema.Types.ObjectId,
    ref: "Weight"
  }], // array of weight input data
});

// passportLocalMongoose will add a username, hash and salt field to store passwords securely
// Also adds some additional methods to the schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
