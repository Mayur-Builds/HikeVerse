const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    userEmail: String,
    trekId: String,
    trekName: String,
    location: String,
    imageUrl: String
});

module.exports = mongoose.model("Favorite", favoriteSchema);