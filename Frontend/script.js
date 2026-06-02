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
    const distance = document.getElementById("distance").value;
    const duration = document.getElementById("duration").value;
    const bestSeason = document.getElementById("bestSeason").value;
    const thingsToCarry = document.getElementById("thingsToCarry").value;
    const emergencyContact = document.getElementById("emergencyContact").value;
    const mapLink = document.getElementById("mapLink").value;

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
            imageUrl,
            distance,
            duration,
bestSeason,
thingsToCarry,
emergencyContact,
mapLink
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
            <div class="trek-card" onclick="openTrek('${trek._id}')">

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


function openTrek(id) {
    localStorage.setItem("selectedTrek", id);
    window.location.href = "trek-details.html";
}


function searchTreks() {

    const input =
        document.getElementById("searchInput").value.toLowerCase();

    const cards =
        document.querySelectorAll(".trek-card");

    cards.forEach((card) => {

        const title =
            card.querySelector("h2").innerText.toLowerCase();

        if (title.includes(input)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}
async function loadTrekDetails() {

    const trekId = localStorage.getItem("selectedTrek");

    const response =
        await fetch(`http://localhost:5000/trek/${trekId}`);

    const trek = await response.json();

    document.getElementById("trekName").innerText =
        trek.trekName;

    document.getElementById("trekImage").src =
        trek.imageUrl;

    document.getElementById("location").innerText =
        "Location: " + trek.location;

    document.getElementById("difficulty").innerText =
        "Difficulty: " + trek.difficulty;

    document.getElementById("description").innerText =
        trek.description;


    document.getElementById("distance").innerText =
    "Distance: " + trek.distance;

document.getElementById("duration").innerText =
    "Duration: " + trek.duration;

document.getElementById("bestSeason").innerText =
    "Best Season: " + trek.bestSeason;

document.getElementById("thingsToCarry").innerText =
    "Things To Carry: " + trek.thingsToCarry;

document.getElementById("emergencyContact").innerText =
    "Emergency Contact: " + trek.emergencyContact;

document.getElementById("mapLink").href =
    trek.mapLink;   
    loadWeather(trek.location); 
}

async function deleteTrek() {

    const trekId = localStorage.getItem("selectedTrek");

    const confirmDelete =
        confirm("Are you sure you want to delete this trek?");

    if (!confirmDelete) return;

    const response =
        await fetch(`http://localhost:5000/trek/${trekId}`, {
            method: "DELETE"
        });

    const data = await response.text();

    alert(data);

    window.location.href = "treks.html";
}
function goToEditTrek() {
    window.location.href = "edit-trek.html";
}

async function loadEditTrek() {

    const trekId = localStorage.getItem("selectedTrek");

    const response =
        await fetch(`http://localhost:5000/trek/${trekId}`);

    const trek = await response.json();

    document.getElementById("trekName").value = trek.trekName;
    document.getElementById("location").value = trek.location;
    document.getElementById("difficulty").value = trek.difficulty;
    document.getElementById("description").value = trek.description;
    document.getElementById("imageUrl").value = trek.imageUrl;
    document.getElementById("distance").value = trek.distance;
document.getElementById("duration").value = trek.duration;
document.getElementById("bestSeason").value = trek.bestSeason;
document.getElementById("thingsToCarry").value = trek.thingsToCarry;
document.getElementById("emergencyContact").value = trek.emergencyContact;
document.getElementById("mapLink").value = trek.mapLink;
}

async function updateTrek() {

    const trekId = localStorage.getItem("selectedTrek");

    const trekName = document.getElementById("trekName").value;
    const location = document.getElementById("location").value;
    const difficulty = document.getElementById("difficulty").value;
    const description = document.getElementById("description").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const distance = document.getElementById("distance").value;
const duration = document.getElementById("duration").value;
const bestSeason = document.getElementById("bestSeason").value;
const thingsToCarry = document.getElementById("thingsToCarry").value;
const emergencyContact = document.getElementById("emergencyContact").value;
const mapLink = document.getElementById("mapLink").value;


    const response =
        await fetch(`http://localhost:5000/trek/${trekId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
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
            })
        });

    const data = await response.text();

    alert(data);

    window.location.href = "treks.html";
}

async function loadWeather(location) {

    const response =
        await fetch(`http://localhost:5000/weather/${location}`);

    const weather = await response.json();

    document.getElementById("temperature").innerText =
        "Temperature: " + weather.temperature_2m + "°C";

    document.getElementById("windSpeed").innerText =
        "Wind Speed: " + weather.wind_speed_10m + " km/h";

    document.getElementById("humidity").innerText =
        "Humidity: " + weather.relative_humidity_2m + "%";

    let advice = "";

    if (weather.temperature_2m > 35) {
        advice = "⚠️ Very hot. Carry extra water and avoid afternoon trekking.";
    } else if (weather.wind_speed_10m > 30) {
        advice = "⚠️ Strong winds. Be careful on exposed mountain trails.";
    } else {
        advice = "✅ Weather looks suitable for trekking.";
    }

    document.getElementById("weatherAdvice").innerText = advice;
}

async function addToFavorite() {

    const userEmail = localStorage.getItem("loggedInUser");
    const trekId = localStorage.getItem("selectedTrek");

    const response = await fetch(`http://localhost:5000/trek/${trekId}`);
    const trek = await response.json();

    const favoriteResponse = await fetch("http://localhost:5000/favorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userEmail,
            trekId,
            trekName: trek.trekName,
            location: trek.location,
            imageUrl: trek.imageUrl
        })
    });

    const data = await favoriteResponse.text();

    alert(data);
}

async function loadFavorites() {

    const userEmail =
        localStorage.getItem("loggedInUser");

    const response =
        await fetch(`http://localhost:5000/favorites/${userEmail}`);

    const favorites = await response.json();

    const container =
        document.getElementById("favoriteContainer");

    container.innerHTML = "";

    favorites.forEach((favorite) => {

        container.innerHTML += `
            <div class="favorite-card">

                <img src="${favorite.imageUrl}">

                <div class="favorite-card-content">

                    <h2>${favorite.trekName}</h2>

                    <p>${favorite.location}</p>

                </div>

            </div>
        `;

    });

}