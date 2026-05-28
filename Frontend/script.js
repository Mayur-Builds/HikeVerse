// Simple test to check JS is working
console.log("HikeVerse JS Loaded");

const button = document.querySelector("button");

button.addEventListener("click", function () {
    alert("Start Exploring HikeVerse 🚀");
});

function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please fill all fields");
    } else {
        alert("Login Successful 🚀");
    }
}


function signupUser() {
    const user = document.getElementById("username").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (user === "" || email === "" || password === "") {
        alert("Please fill all fields");
    } else {
        alert("Account Created Successfully 🚀");
    }
}