/* ================= THEME TOGGLE ================= */

const toggleBtn = document.getElementById("toggle-theme");

if (toggleBtn) {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      toggleBtn.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      toggleBtn.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  });
}


/* ================= NAVBAR ACTIVE LINK ================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});


/* ================= GALLERY MODAL ================= */

let images = document.querySelectorAll(".gallery-grid img");
let currentIndex = 0;

function openImage(src) {
  images.forEach((img, index) => {
    if (img.src === src) currentIndex = index;
  });

  document.getElementById("modal-img").src = images[currentIndex].src;
  document.getElementById("image-modal").style.display = "flex";
}

function closeImage() {
  document.getElementById("image-modal").style.display = "none";
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  document.getElementById("modal-img").src = images[currentIndex].src;
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  document.getElementById("modal-img").src = images[currentIndex].src;
}


/* ================= HERO BUTTONS ================= */

function openReservation() {
  const section = document.getElementById("reservation");
  section.style.display = "block";
  section.scrollIntoView({ behavior: "smooth" });
}

function scrollToMenu() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}


/* ================= ADMIN LOGIN ================= */

let adminSection = document.getElementById("admin");
let adminForm = document.getElementById("admin-form");

function show_admin_login() {
  adminSection.style.display = "block";
  adminSection.scrollIntoView({ behavior: "smooth" });
}

if (adminForm) {
  adminForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let username = document.getElementById("input_user").value.trim();
    let password = document.getElementById("input_pass").value.trim();

    let storedUsername = "Mansi";
    let storedPassword = "SRK123";

    if (username === storedUsername && password === storedPassword) {
      alert("Login successful!");

      adminSection.style.display = "none";
      document.getElementById("user-responses").style.display = "block";
      document.getElementById("admin-reservations").style.display = "block";

      fetchUserResponses();
      fetchReservations();
    } else {
      alert("Access Denied!");
    }
  });
}


/* ================= CONTACT FORM ================= */

let contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let response = {
      name: document.getElementById("input_name").value.trim(),
      email: document.getElementById("input_email").value.trim(),
      message: document.getElementById("input_msg").value.trim(),
      date: new Date().toLocaleString()
    };

    if (response.name.length < 3) {
      alert("Name must be at least 3 characters");
      return;
    }

    if (!response.email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    if (response.message.length < 10) {
      alert("Message must be at least 10 characters");
      return;
    }

    let db = JSON.parse(localStorage.getItem("tempDB")) || [];
    db.push(response);
    localStorage.setItem("tempDB", JSON.stringify(db));

    this.reset();
    document.getElementById("confirm-response").innerHTML =
      "✅ Thank you! We will get back to you soon.";
  });
}


/* ================= FETCH USER MESSAGES ================= */

function fetchUserResponses() {
  let container = document.getElementById("user-messages");
  container.innerHTML = "";

  let db = JSON.parse(localStorage.getItem("tempDB")) || [];

  db.forEach((res) => {
    let div = document.createElement("div");
    div.innerHTML = `
      <p><strong>Name:</strong> ${res.name}</p>
      <p><strong>Email:</strong> ${res.email}</p>
      <p><strong>Message:</strong> ${res.message}</p>
      <p><strong>Date:</strong> ${res.date}</p>
      <hr>
    `;
    container.appendChild(div);
  });
}


/* ================= RESERVATION FORM ================= */

let reservationForm = document.getElementById("reservation-form");

if (reservationForm) {
  reservationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let reservation = {
      name: document.getElementById("res_name").value.trim(),
      date: document.getElementById("res_date").value,
      time: document.getElementById("res_time").value,
      guests: document.getElementById("res_guests").value,
      createdAt: new Date().toLocaleString()
    };

    let reservations =
      JSON.parse(localStorage.getItem("reservationsDB")) || [];

    let alreadyBooked = reservations.some(r =>
      r.date === reservation.date && r.time === reservation.time
    );

    if (alreadyBooked) {
      alert("This slot is already booked. Please choose another.");
      return;
    }

    reservations.push(reservation);
    localStorage.setItem("reservationsDB", JSON.stringify(reservations));

    this.reset();
    document.getElementById("reservation-confirm").innerHTML =
      "✅ Table reserved successfully!";
  });
}


/* ================= FETCH RESERVATIONS ================= */

function fetchReservations() {
  let container = document.getElementById("reservation-list");
  container.innerHTML = "";

  let reservations =
    JSON.parse(localStorage.getItem("reservationsDB")) || [];

  reservations.forEach((res) => {
    let div = document.createElement("div");
    div.innerHTML = `
      <p><strong>Name:</strong> ${res.name}</p>
      <p><strong>Date:</strong> ${res.date}</p>
      <p><strong>Time:</strong> ${res.time}</p>
      <p><strong>Guests:</strong> ${res.guests}</p>
      <p><strong>Booked On:</strong> ${res.createdAt}</p>
      <hr>
    `;
    container.appendChild(div);
  });
}


/* ================= REVIEW CAROUSEL ================= */
/* ✅ ONLY ADDED SAFETY + STRUCTURE, LOGIC SAME */

document.addEventListener("DOMContentLoaded", () => {

  let reviewIndex = 0;
  let reviews = document.querySelectorAll(".review-carousel .review-box");
  let dots = document.querySelectorAll(".review-dots .dot");

  function showReview(index){
    reviews.forEach((review, i) => {
      review.classList.remove("active");
      dots[i].classList.remove("active");

      if(i === index){
        review.classList.add("active");
        dots[i].classList.add("active");
      }
    });
  }

  if (reviews.length > 0) {
    setInterval(() => {
      reviewIndex = (reviewIndex + 1) % reviews.length;
      showReview(reviewIndex);
    }, 3000);
  }

});


