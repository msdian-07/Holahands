// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTYFKOmMnP38s2Khb3kPI_pme4DpJn6l0",
    authDomain: "henna-7e094.firebaseapp.com",
    databaseURL: "https://henna-7e094-default-rtdb.firebaseio.com",
    projectId: "henna-7e094",
    storageBucket: "henna-7e094.appspot.com",
    messagingSenderId: "1087217375273",
    appId: "1:1087217375273:web:71c5c47b2800857d2e2438",
    measurementId: "G-ZHEWB3EZCG"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ✅ Wait for DOM to Load Before Attaching Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    // Form handling
    const bookingForm = document.getElementById("bookingForm");
    
    // Gallery slider functionality
    const galleryItems = document.querySelectorAll(".gallery-item");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    let currentSlide = 0;
    const itemsToShow = window.innerWidth < 768 ? 1 : 3;
    
    // Initially hide all items except the first few
    setupGallery();
    
    function setupGallery() {
        galleryItems.forEach((item, index) => {
            if (index < itemsToShow) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }

            // Add click event to gallery items
            item.addEventListener("click", function() {
                // Get the design ID from the top overlay
                const designIdElement = this.querySelector(".top-overlay");
                if (designIdElement) {
                    // Extract only the design ID number (D001 -> D001)
                    const designId = designIdElement.textContent;
                    
                    // Scroll to booking section
                    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
                    
                    // Set the design ID in the form
                    setTimeout(() => {
                        const designIdInput = document.getElementById("design_id");
                        if (designIdInput) {
                            designIdInput.value = designId;
                            // Add highlight effect
                            designIdInput.classList.add("highlight-input");
                            setTimeout(() => {
                                designIdInput.classList.remove("highlight-input");
                            }, 1500);
                        }
                    }, 800); // Small delay to ensure smooth scrolling completes
                }
            });
        });
    }
    
    // Next slide function
    nextBtn.addEventListener("click", () => {
        currentSlide++;
        if (currentSlide > galleryItems.length - itemsToShow) {
            currentSlide = 0;
        }
        updateGallery();
    });
    
    // Previous slide function
    prevBtn.addEventListener("click", () => {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = galleryItems.length - itemsToShow;
        }
        updateGallery();
    });
    
    function updateGallery() {
        galleryItems.forEach((item, index) => {
            if (index >= currentSlide && index < currentSlide + itemsToShow) {
                item.style.display = "block";
                // Add fade-in animation
                item.style.animation = "fadeIn 0.5s forwards";
            } else {
                item.style.display = "none";
            }
        });
    }
    
    // Auto-slide every 5 seconds
    setInterval(() => {
        currentSlide++;
        if (currentSlide > galleryItems.length - itemsToShow) {
            currentSlide = 0;
        }
        updateGallery();
    }, 5000);
    
    // Window resize event to adjust visible items
    window.addEventListener("resize", () => {
        const newItemsToShow = window.innerWidth < 768 ? 1 : 3;
        if (newItemsToShow !== itemsToShow) {
            currentSlide = 0;
            setupGallery();
        }
    });

    // Form submission handling
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            console.log("Form submitted!"); // Debugging log

            // ✅ Get user input values
            let name = document.getElementById("name").value.trim();
            let contact = document.getElementById("contact").value.trim();
            let date = document.getElementById("date").value.trim();
            let design_id = document.getElementById("design_id").value.trim();
            let message = document.getElementById("message").value.trim();

            // ✅ Basic Validation
            if (name === "" || contact === "" || date === "") {
                alert("Please fill in all required fields.");
                return;
            }

            if (!/^\d{10}$/.test(contact)) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }

            // ✅ Generate Current Date & Time
            const bookingTime = new Date().toLocaleString(); // Format: "MM/DD/YYYY, HH:MM:SS AM/PM"

            console.log("📩 Booking Details:", name, contact, date, message, bookingTime); // Debugging log

            // ✅ Store Data in Firebase Database
            push(ref(database, "bookings/"), {
                name: name,
                contact: contact,
                date: date,
                message: message,
                design_id: design_id,
                time: bookingTime // ✅ Store timestamp
            }).then(() => {
                console.log("✅ Booking added successfully!");
                alert("🎉 Booking Successful! We will contact you soon.");
                bookingForm.reset();
            }).catch((error) => {
                console.error("❌ Error adding booking:", error);
                alert("Booking failed. Check console for errors.");
            });
        });
    } else {
        console.error("❌ Booking form not found on the page.");
    }
});

// Show Scroll Button when Scrolling Down
window.onscroll = function () {
    let scrollBtn = document.getElementById("scrollUpBtn");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollBtn.style.display = "flex";
    } else {
        scrollBtn.style.display = "none";
    }
};

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({ 
        top: 0, 
        behavior: "smooth" 
    });
}

// Make scrollToTop globally accessible
window.scrollToTop = scrollToTop;

// Add animation styles to the document
document.head.insertAdjacentHTML('beforeend', `
    <style>
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .gallery-item {
        animation: fadeIn 0.5s forwards;
    }
    
    .highlight-input {
        animation: highlightEffect 1.5s ease;
    }
    
    @keyframes highlightEffect {
        0% { background-color: #ffffff; }
        50% { background-color: #ffd4a4; }
        100% { background-color: #ffffff; }
    }
    </style>
`);