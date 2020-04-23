const mongoose = require("mongoose");

//Embedded Schema, creating an array of weights, referenced to individual users
let weightSchema = mongoose.Schema({
    weight: Number,
    date: Date,
});

const Weight = mongoose.model("Weight", weightSchema);

module.exports = Weight;