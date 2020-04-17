const mongoose = require("mongoose");

//Embedded Schema
let weightSchema = mongoose.Schema({
    weight: Number,
    date: Date,
});

const Weight = mongoose.model("Weight", weightSchema);

module.exports = Weight;