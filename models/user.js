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
  weights: [{ //Weights added here
    type: mongoose.Schema.Types.ObjectId,
    ref: "Weight"
  }
  ], // array of weight input data
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
