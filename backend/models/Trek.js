const mongoose = require("mongoose");

const trekSchema = new mongoose.Schema({
    trekName: String,
    location: String,
    difficulty: String,
    description: String,
    imageUrl: String,

    distance: String,
    duration: String,
    bestSeason: String,
    thingsToCarry: String,
    emergencyContact: String,
    mapLink: String
});

module.exports = mongoose.model("Trek", trekSchema);