// Select the navigation elements
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");

// Open and close the mobile navigation menu
menuToggle.addEventListener("click", function () {
    const isOpen = navbar.classList.toggle("menu-open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the menu after selecting a navigation link
navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navbar.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});