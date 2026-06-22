const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    trekId: {
        type: String,
        required: true
    },
    trekName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    bookingDate: {
        type: String,
        required: true
    },
    peopleCount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);