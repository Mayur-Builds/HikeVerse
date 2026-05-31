const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const User = require("./models/User");
const Trek = require("./models/Trek");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb://mayur:MAYURMAYUR@ac-kaizhuq-shard-00-00.awwvtrw.mongodb.net:27017,ac-kaizhuq-shard-00-01.awwvtrw.mongodb.net:27017,ac-kaizhuq-shard-00-02.awwvtrw.mongodb.net:27017/?ssl=true&replicaSet=atlas-kfq1cx-shard-0&authSource=admin&appName=hikeverseDB"
)
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
            imageUrl
        } = req.body;

        const newTrek = new Trek({
            trekName,
            location,
            difficulty,
            description,
            imageUrl
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
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});