require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const User = require("./models/User");
const Trek = require("./models/Trek");
const Favorite = require("./models/Favorite");

const app = express();

app.use(cors());
app.use(express.json());

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

        res.send("Login Successful 🚀");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});

// Add Trek Route
app.post("/add-trek", async (req, res) => {

    try {

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

        await Trek.findByIdAndDelete(req.params.id);

        res.send("Trek Deleted Successfully 🗑️");

    } catch (error) {

        console.log(error);
        res.status(500).send("Error");

    }

});

app.put("/trek/:id", async (req, res) => {

    try {

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

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});