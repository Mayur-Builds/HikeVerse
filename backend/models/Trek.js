const mongoose = require("mongoose");

const trekSchema = new mongoose.Schema({
    trekName: String,
    location: String,
    difficulty: String,
    description: String,
    imageUrl: String
});

module.exports = mongoose.model("Trek", trekSchema);