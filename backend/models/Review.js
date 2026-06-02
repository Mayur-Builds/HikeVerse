const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    trekId: String,
    userEmail: String,
    rating: Number,
    comment: String
});

module.exports = mongoose.model("Review", reviewSchema);