const express = require("express");

const app = express();
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("HikeVerse Backend Running 🚀");
});

app.post("/signup", (req, res) => {

    const { username, email, password } = req.body;

    console.log(username);
    console.log(email);

    res.send("Signup API Working 🚀");

});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    console.log(email);

    res.send("Login API Working 🚀");

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});