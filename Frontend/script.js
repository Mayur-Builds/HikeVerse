// Simple test to check JS is working
console.log("HikeVerse JS Loaded");



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



    const data = await response.json();

    if (data.message === "Login Successful") {

        localStorage.setItem("loggedInUser", email);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userRole", data.role);

        window.location.href = "dashboard.html";

    } else {
        alert(data.message || "Login failed");
    }}


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

    // Validation
   if (
    !trekName.trim() ||
    !location.trim() ||
    !difficulty.trim() ||
    !description.trim() ||
    !imageUrl.trim() ||
    !distance.trim() ||
    !duration.trim() ||
    !bestSeason.trim() ||
    !thingsToCarry.trim() ||
    !emergencyContact.trim() ||
    !mapLink.trim()
) {
    alert("Please fill all fields.");
    return;
}
    const role = localStorage.getItem("userRole");

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
            mapLink,
            role
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

        <p><b>Rating:</b> ⭐ ${trek.rating || "4.5"}</p>

        <p><b>Price:</b> ₹${trek.price || "999"}</p>

        <p>${trek.description.substring(0, 100)}...</p>

        <button class="view-btn">View Details</button>

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
    "Description: " + trek.description;


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
    loadReviews();
}

async function deleteTrek() {
    const role = localStorage.getItem("userRole");

    const trekId = localStorage.getItem("selectedTrek");

    const confirmDelete =
        confirm("Are you sure you want to delete this trek?");

    if (!confirmDelete) return;

const response =
    await fetch(`http://localhost:5000/trek/${trekId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            role
        })
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
const role = localStorage.getItem("userRole");

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
mapLink,
role
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
        <div class="favorite-card"
             onclick="openFavoriteTrek('${favorite.trekId}')"
             style="cursor:pointer;">

            <img src="${favorite.imageUrl}">

            <div class="favorite-card-content">

                <h2>${favorite.trekName}</h2>

                <p>${favorite.location}</p>

            </div>

        </div>
        `;

    });

}
async function addReview() {

    const trekId = localStorage.getItem("selectedTrek");
    const userEmail = localStorage.getItem("loggedInUser");

    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;
    if (rating < 1 || rating > 5) {
    alert("Please enter a rating between 1 and 5");
    return;
}

if (comment === "") {
    alert("Please write a review comment");
    return;
}
    const response = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            trekId,
            userEmail,
            rating,
            comment
        })
    });

    const data = await response.text();

    alert(data);
    loadReviews();
}
async function loadReviews() {

    const trekId = localStorage.getItem("selectedTrek");

    const response =
        await fetch(`http://localhost:5000/reviews/${trekId}`);

    const reviews = await response.json();

    const container =
        document.getElementById("reviewContainer");

   container.innerHTML = "";
let totalRating = 0;

reviews.forEach((review) => {

    totalRating += Number(review.rating);

    container.innerHTML += `
        <div class="review-card">
            <h3>⭐ ${review.rating}/5</h3>
            <p>${review.comment}</p>
            <small>By: ${review.userEmail}</small>
        </div>
    `;

});

    
    if (reviews.length > 0) {
    const average = totalRating / reviews.length;

    document.getElementById("averageRating").innerHTML =
    `⭐ Average Rating: <b>${average.toFixed(1)}/5</b> (${reviews.length} reviews)`;
} else {
    document.getElementById("averageRating").innerText =
        "No reviews yet";
}
}
function openFavoriteTrek(trekId) {

    localStorage.setItem("selectedTrek", trekId);

    window.location.href = "trek-details.html";

}

async function loadStats() {

    const userEmail = localStorage.getItem("loggedInUser");

    const response =
        await fetch(`http://localhost:5000/stats/${userEmail}`);

    const stats = await response.json();

    document.getElementById("totalTreks").innerText =
        "🏔️ Total Treks: " + stats.totalTreks;

    document.getElementById("totalFavorites").innerText =
        "❤️ Favorites: " + stats.totalFavorites;

    document.getElementById("totalReviews").innerText =
        "⭐ Reviews: " + stats.totalReviews;
}
function checkAdminAccess() {

    const role = localStorage.getItem("userRole");

    if (role !== "admin") {

        document.querySelectorAll(".admin-only").forEach(item => {
            item.style.display = "none";
        });

    }

}




