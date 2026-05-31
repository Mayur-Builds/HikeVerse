// Simple test to check JS is working
console.log("HikeVerse JS Loaded");

const button = document.querySelector("button");

button.addEventListener("click", function () {
    alert("Start Exploring HikeVerse 🚀");
});

async function loginUser() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.text();

    if (data === "Login Successful 🚀") {

    localStorage.setItem("loggedInUser", email);

    window.location.href = "dashboard.html";

} else {

    alert(data);

}
}


async function signupUser() {

    const username = document.getElementById("username").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    const data = await response.text();

    alert(data);
}

async function addTrek() {

    const trekName = document.getElementById("trekName").value;
    const location = document.getElementById("location").value;
    const difficulty = document.getElementById("difficulty").value;
    const description = document.getElementById("description").value;
    const imageUrl = document.getElementById("imageUrl").value;

    const response = await fetch("http://localhost:5000/add-trek", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            trekName,
            location,
            difficulty,
            description,
            imageUrl
        })
    });

    const data = await response.text();

    alert(data);
}

async function loadTreks() {
    const response = await fetch("http://localhost:5000/treks");

    const treks = await response.json();

    const container = document.getElementById("trekContainer");

    container.innerHTML = "";

    treks.forEach((trek) => {
        container.innerHTML += `
           <div class="trek-card">
    <img src="${trek.imageUrl}" alt="${trek.trekName}">
    <div class="trek-card-content">
        <h2>${trek.trekName}</h2>
        <p><b>Location:</b> ${trek.location}</p>
        <p><b>Difficulty:</b> ${trek.difficulty}</p>
        <p>${trek.description}</p>
    </div>
</div>
        `;
    });
}