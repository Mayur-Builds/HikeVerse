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
    const image = document.getElementById("image").files[0];
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
    !image||
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

  const formData = new FormData();

formData.append("trekName", trekName);
formData.append("location", location);
formData.append("difficulty", difficulty);
formData.append("description", description);
formData.append("image", image);
formData.append("distance", distance);
formData.append("duration", duration);
formData.append("bestSeason", bestSeason);
formData.append("thingsToCarry", thingsToCarry);
formData.append("emergencyContact", emergencyContact);
formData.append("mapLink", mapLink);
formData.append("role", localStorage.getItem("userRole"));

const response = await fetch("http://localhost:5000/add-trek", {
    method: "POST",
    body: formData
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

<div class="trek-image-box">
    <img src="${trek.imageUrl || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'}" 
         alt="${trek.trekName}">
    <span class="rating-badge">⭐ ${trek.rating || "4.5"}</span>
</div>

    <div class="trek-card-content">
        <h2>${trek.trekName}</h2>

        <p><b>Location:</b> ${trek.location}</p>

        <p>
    <b>Difficulty:</b>
    <span class="difficulty-badge ${trek.difficulty.toLowerCase()}">
        ${trek.difficulty}
    </span>
</p>

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

   let badgeColor = "#f1c40f";

if(trek.difficulty === "Easy")
    badgeColor = "#2ecc71";

if(trek.difficulty === "Hard")
    badgeColor = "#e74c3c";

document.getElementById("difficulty").innerHTML =
`
Difficulty:
<span style="
background:${badgeColor};
padding:6px 12px;
border-radius:20px;
color:white;
font-weight:bold;
">
${trek.difficulty}
</span>
`;

    document.getElementById("description").innerText =
    "Description: " + trek.description;


    document.getElementById("distance").innerText =
    "Distance: " + trek.distance;

document.getElementById("duration").innerText =
    "Duration: " + trek.duration;

document.getElementById("bestSeason").innerText =
    "Best Season: " + trek.bestSeason;

document.getElementById("thingsToCarry").innerHTML =
    trek.thingsToCarry
        .split("\n")
        .map(item => `<li>${item}</li>`)
        .join("");

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

            <img src="${favorite.imageUrl || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'}">

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
animateCounter("totalTreks", stats.totalTreks);
animateCounter("totalFavorites", stats.totalFavorites);
animateCounter("totalReviews", stats.totalReviews);
}

function animateCounter(elementId, target) {

    let count = 0;
    const element = document.getElementById(elementId);

    const interval = setInterval(() => {

        if (count >= target) {
            clearInterval(interval);
            element.innerText = target;
            return;
        }

        count++;
        element.innerText = count;

    }, 80);
}async function loadFeaturedTreks() {
    try {
        const response = await fetch("http://localhost:5000/treks");
        const treks = await response.json();

        const container = document.getElementById("featuredTreks");

        if (!container) return;

        container.innerHTML = "";

        const defaultImage = "https://images.unsplash.com/photo-1501785888041-af3ef285b470";

        treks.slice(0, 3).forEach((trek) => {
            container.innerHTML += `
                <div class="trek-card" onclick="openTrek('${trek._id}')">
                    <img src="${trek.imageUrl || defaultImage}" alt="${trek.trekName}">

                    <div class="trek-card-content">
                        <h2>${trek.trekName}</h2>
                        <p><b>Location:</b> ${trek.location}</p>
                        <p><b>Difficulty:</b> ${trek.difficulty}</p>
                        <p>${trek.description ? trek.description.substring(0, 80) : "No description available"}...</p>
                        <button class="view-btn">Explore Trek</button>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.log("Featured treks loading error:", error);
    }
}
function checkAdminAccess() {

    const role = localStorage.getItem("userRole");

    if (role === "admin") {

        document.querySelectorAll(".user-only").forEach(item => {
            item.style.display = "none";
        });

    } else {

        document.querySelectorAll(".admin-only").forEach(item => {
            item.style.display = "none";
        });

    }
}
function filterTreks(difficulty) {

    const cards = document.querySelectorAll(".trek-card");
    const buttons = document.querySelectorAll(".filter-buttons button");

    buttons.forEach(button => {
        button.classList.remove("active");

        if (button.innerText === difficulty) {
            button.classList.add("active");
        }
    });

    cards.forEach(card => {

        const cardText = card.innerText;

        if (difficulty === "All" || cardText.includes(difficulty)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}
function sortTreks() {

    const container = document.getElementById("trekContainer");

    const cards = Array.from(
        document.querySelectorAll(".trek-card")
    );

    const sortValue =
        document.getElementById("sortSelect").value;

    cards.sort((a, b) => {

        const nameA =
            a.querySelector("h2").innerText.toLowerCase();

        const nameB =
            b.querySelector("h2").innerText.toLowerCase();

        if (sortValue === "az") {
            return nameA.localeCompare(nameB);
        }

        if (sortValue === "za") {
            return nameB.localeCompare(nameA);
        }
        if (sortValue === "difficulty") {
    const order = {
        "Easy": 1,
        "Moderate": 2,
        "Hard": 3
    };

    const diffA = a.innerText.includes("Easy")
        ? "Easy"
        : a.innerText.includes("Moderate")
        ? "Moderate"
        : "Hard";

    const diffB = b.innerText.includes("Easy")
        ? "Easy"
        : b.innerText.includes("Moderate")
        ? "Moderate"
        : "Hard";

    return order[diffA] - order[diffB];
}
        return 0;
    });

    container.innerHTML = "";

    cards.forEach(card => {
        container.appendChild(card);
    });
}
async function requestBooking() {

    const trekId = localStorage.getItem("selectedTrek");
    const userEmail = localStorage.getItem("loggedInUser");

    const trekResponse =
        await fetch(`http://localhost:5000/trek/${trekId}`);

    const trek = await trekResponse.json();

    const bookingDate =
        document.getElementById("bookingDate").value;

    const peopleCount =
        document.getElementById("peopleCount").value;

    if (!bookingDate || !peopleCount) {
        alert("Please fill all booking details");
        return;
    }

    const response = await fetch(
        "http://localhost:5000/booking",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                trekId,
                trekName: trek.trekName,
                userEmail,
                bookingDate,
                peopleCount
            })
        }
    );

    const data = await response.text();

    alert(data);
}
async function loadBookings() {

    const response =
        await fetch("http://localhost:5000/bookings");

    const bookings =
        await response.json();

    const container =
        document.getElementById("bookingContainer");

    if (!container) return;

    container.innerHTML = "";

    bookings.forEach((booking) => {

        container.innerHTML += `
            <div class="booking-card">

                <h2>🏔️ ${booking.trekName}</h2>

                <p><b>User:</b> ${booking.userEmail}</p>

                <p><b>Date:</b> ${booking.bookingDate}</p>

                <p><b>People:</b> ${booking.peopleCount}</p>

              <p class="status-pending">
    Status: ${booking.status}
</p>

<button class="btn btn-green"
onclick="updateBookingStatus('${booking._id}','Approved')">
Approve
</button>

<button class="btn btn-red"
onclick="updateBookingStatus('${booking._id}','Rejected')">
Reject
</button>
            </div>
        `;
    });
}
async function updateBookingStatus(id, status) {

    const response = await fetch(
        `http://localhost:5000/booking/${id}/status`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: status
            })
        }
    );

    const data = await response.text();

    alert(data);

    loadBookings();
}


async function loadMyBookings() {

    const userEmail =
        localStorage.getItem("loggedInUser");

    const response =
        await fetch(
            `http://localhost:5000/my-bookings/${userEmail}`
        );

    const bookings =
        await response.json();

    const container =
        document.getElementById("myBookingsContainer");

    if (!container) return;

    container.innerHTML = "";

    bookings.forEach((booking) => {

        let statusClass = "status-pending";

        if (booking.status === "Approved") {
            statusClass = "status-approved";
        }

        if (booking.status === "Rejected") {
            statusClass = "status-rejected";
        }

        container.innerHTML += `
            <div class="my-booking-card">

                <h2>🏔️ ${booking.trekName}</h2>

                <p><b>Date:</b> ${booking.bookingDate}</p>

                <p><b>People:</b> ${booking.peopleCount}</p>

                <p class="${statusClass}">
                    Status: ${booking.status}
                </p>

            </div>
        `;
    });
}
async function loadProfile() {

    const userEmail = localStorage.getItem("loggedInUser");
    const username = localStorage.getItem("username") || userEmail;

    const response =
        await fetch(`http://localhost:5000/profile/${userEmail}`);

    const data = await response.json();

    document.getElementById("profileName").innerText =
        username;

    document.getElementById("profileEmail").innerText =
        userEmail;

    document.getElementById("profileBookings").innerText =
        data.totalBookings;

    document.getElementById("profileFavorites").innerText =
        data.totalFavorites;

    document.getElementById("profileReviews").innerText =
        data.totalReviews;
}

async function loadAnalytics() {

    const response =
        await fetch("http://localhost:5000/admin-analytics");

    const data =
        await response.json();

    document.getElementById("totalTreksCount").innerText =
        data.totalTreks;

    document.getElementById("totalBookingsCount").innerText =
        data.totalBookings;

    document.getElementById("approvedBookingsCount").innerText =
        data.approvedBookings;

    document.getElementById("pendingBookingsCount").innerText =
        data.pendingBookings;

    document.getElementById("rejectedBookingsCount").innerText =
        data.rejectedBookings;

    const popularTrek =
    document.getElementById("mostPopularTrek");

    document.getElementById("highestRatedTrek").innerText =
    `${data.highestRatedTrek} (${data.highestRating}/5)`;

if(popularTrek){
    popularTrek.innerText =
        data.mostPopularTrek;
}

const chart = document.getElementById("bookingChart");

if (chart) {
  new Chart(chart, {
    type: "doughnut",
    data: {
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [{
            data: [
                data.approvedBookings,
                data.pendingBookings,
                data.rejectedBookings
            ],
            backgroundColor: [
                "#2ecc71",
                "#f1c40f",
                "#e74c3c"
            ]
        }]
    }
});
}
}