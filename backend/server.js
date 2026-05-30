const mongoose = require("mongoose");
const express = require("express");
const User = require("./models/User");

const app = express();
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

app.get("/", (req, res) => {
    res.send("HikeVerse Backend Running 🚀");
});

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});