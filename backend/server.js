require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const User = require("./models/User");
const Trek = require("./models/Trek");
const Favorite = require("./models/favorite");
const Review = require("./models/Review");
const Booking = require("./models/Booking");

const app = express();
const multer = require("multer");
const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        cb(null, `images/${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected 🚀"))
.catch((err) => {
    console.log("MongoDB Error:");
    console.error(err);
});

const PORT = 5000;

// Home Route
app.get("/", (req, res) => {
    res.send("HikeVerse Backend Running 🚀");
});

// Signup Route
app.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
            password
        });

        await newUser.save();

        res.send("User Registered Successfully 🚀");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});

// Login Route
app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("User Not Found ❌");
        }

        if (user.password !== password) {
            return res.send("Invalid Password ❌");
        }

        res.json({
    message: "Login Successful",
    userId: user._id,
    username: user.username,
    role: user.role
});

    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }



});

  

// Add Trek Route
app.post("/add-trek", upload.single("image"), async (req, res) => {

    try {

     const {
    trekName,
    location,
    difficulty,
    description,
    
    distance,
    duration,
    bestSeason,
    thingsToCarry,
    emergencyContact,
    mapLink
} = req.body;

const imageUrl = req.file ? req.file.location : "";
if (req.body.role !== "admin") {
    return res.status(403).send("Only admin can add treks");
}
if (
    !trekName?.trim() ||
    !location?.trim() ||
    !difficulty?.trim() ||
    !description?.trim() ||
    !imageUrl?.trim() ||
    !distance?.trim() ||
    !duration?.trim() ||
    !bestSeason?.trim() ||
    !thingsToCarry?.trim() ||
    !emergencyContact?.trim() ||
    !mapLink?.trim()
) {
    return res.status(400).send("All fields are required");
}

        const newTrek = new Trek({
    trekName,
    location,
    difficulty,
    description,
    imageUrl,
    distance,
    duration,
    bestSeason,
    thingsToCarry,
    emergencyContact,
    mapLink
});

        await newTrek.save();

        res.send("Trek Added Successfully 🏔️");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});
app.get("/treks", async (req, res) => {
    try {
        const treks = await Trek.find();
        res.json(treks);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }
});
app.get("/trek/:id", async (req, res) => {

    try {

        const trek = await Trek.findById(req.params.id);

        res.json(trek);

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});

app.delete("/trek/:id", async (req, res) => {

    try {

        if (req.body.role !== "admin") {
            return res.status(403).send("Only admin can delete treks");
        }

        await Trek.findByIdAndDelete(req.params.id);

        res.send("Trek Deleted Successfully 🗑️");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});

app.put("/trek/:id", async (req, res) => {

    try {
        if (req.body.role !== "admin") {
    return res.status(403).send("Only admin can edit treks");
}

        const {
            trekName,
            location,
            difficulty,
            description,
            imageUrl,
            distance,
duration,
bestSeason,
thingsToCarry,
emergencyContact,
mapLink
        } = req.body;

        await Trek.findByIdAndUpdate(req.params.id, {
            trekName,
            location,
            difficulty,
            description,
            imageUrl,
            distance,
duration,
bestSeason,
thingsToCarry,
emergencyContact,
mapLink
        });

        res.send("Trek Updated Successfully ✏️");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});


app.get("/weather/:location", async (req, res) => {
    try {
        const location = encodeURIComponent(req.params.location);

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            return res.send("Location not found");
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`
        );

        const weatherData = await weatherResponse.json();

        res.json(weatherData.current);

    } catch (error) {
        console.log(error);
        res.status(500).send("Weather Error");
    }
});

app.post("/favorite", async (req, res) => {

    try {

        const {
            userEmail,
            trekId,
            trekName,
            location,
            imageUrl
        } = req.body;

        const existingFavorite = await Favorite.findOne({
            userEmail,
            trekId
        });

        if (existingFavorite) {
            return res.send("Trek already in Favorites ❤️");
        }

        const newFavorite = new Favorite({
            userEmail,
            trekId,
            trekName,
            location,
            imageUrl
        });

        await newFavorite.save();

        res.send("Trek Added to Favorites ❤️");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});

app.get("/favorites/:userEmail", async (req, res) => {

    try {

        const favorites = await Favorite.find({
            userEmail: req.params.userEmail
        });

        res.json(favorites);

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});
app.post("/review", async (req, res) => {

    try {

        const {
            trekId,
            userEmail,
            rating,
            comment
        } = req.body;

        const newReview = new Review({
            trekId,
            userEmail,
            rating,
            comment
        });

        await newReview.save();

        res.send("Review Added Successfully ⭐");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});
app.get("/reviews/:trekId", async (req, res) => {

    try {

        const reviews = await Review.find({
            trekId: req.params.trekId
        });

        res.json(reviews);

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});

app.get("/stats/:userEmail", async (req, res) => {

    try {

        const totalTreks = await Trek.countDocuments();

        const totalFavorites = await Favorite.countDocuments({
            userEmail: req.params.userEmail
        });

        const totalReviews = await Review.countDocuments();

        res.json({
            totalTreks,
            totalFavorites,
            totalReviews
        });

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});
app.post("/booking", async (req, res) => {
    try {
        const {
            trekId,
            trekName,
            userEmail,
            bookingDate,
            peopleCount
        } = req.body;

        if (!trekId || !trekName || !userEmail || !bookingDate || !peopleCount) {
            return res.status(400).send("All booking fields are required");
        }

        const newBooking = new Booking({
            trekId,
            trekName,
            userEmail,
            bookingDate,
            peopleCount
        });

        await newBooking.save();

        res.send("Booking request submitted successfully");
    } catch (error) {
        res.status(500).send("Booking failed");
    }
});
app.get("/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).send("Failed to fetch bookings");
    }
});
app.put("/booking/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).send("Status is required");
        }

        await Booking.findByIdAndUpdate(req.params.id, {
            status: status
        });

        res.send("Booking status updated successfully");

    } catch (error) {
        res.status(500).send("Failed to update booking status");
    }
});

app.get("/my-bookings/:userEmail", async (req, res) => {
    try {
        const bookings = await Booking.find({
            userEmail: req.params.userEmail
        }).sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).send("Failed to fetch user bookings");
    }
});

app.get("/profile/:userEmail", async (req, res) => {
    try {

        const userEmail = req.params.userEmail;

        const totalFavorites =
            await Favorite.countDocuments({ userEmail });

        const totalReviews =
            await Review.countDocuments({ userEmail });

        const totalBookings =
            await Booking.countDocuments({ userEmail });

        res.json({
            totalFavorites,
            totalReviews,
            totalBookings
        });

    } catch (error) {

        res.status(500).send("Failed to load profile");

    }
});

app.get("/admin-analytics", async (req, res) => {
    try {
        const totalTreks = await Trek.countDocuments();
        const totalBookings = await Booking.countDocuments();

        const approvedBookings = await Booking.countDocuments({
            status: "Approved"
        });

        const pendingBookings = await Booking.countDocuments({
            status: "Pending"
        });

        const rejectedBookings = await Booking.countDocuments({
            status: "Rejected"
        });
        const popularTrek = await Booking.aggregate([
    {
        $group: {
            _id: "$trekName",
            totalBookings: { $sum: 1 }
        }
    },
    {
        $sort: { totalBookings: -1 }
    },
    {
        $limit: 1
    }
]);
const highestRatedTrek = await Review.aggregate([
    {
        $group: {
            _id: "$trekId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
        }
    },
    {
        $sort: { averageRating: -1 }
    },
    {
        $limit: 1
    }
]);

let highestRatedTrekName = "No reviews yet";
let highestRating = 0;

if (highestRatedTrek.length > 0) {
    const trek = await Trek.findById(highestRatedTrek[0]._id);

    if (trek) {
        highestRatedTrekName = trek.trekName;
        highestRating = highestRatedTrek[0].averageRating.toFixed(1);
    }
}
        res.json({
            totalTreks,
            totalBookings,
            approvedBookings,
            pendingBookings,
            rejectedBookings,
            mostPopularTrek: popularTrek.length > 0 ? popularTrek[0]._id : "No bookings yet",
            highestRatedTrek: highestRatedTrekName,
            highestRating
        });

    } catch (error) {
        res.status(500).send("Failed to load analytics");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
