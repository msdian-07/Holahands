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
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    
    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            nav.classList.toggle("active");
            // Change icon based on menu state
            const icon = this.querySelector("i");
            if (nav.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });
    }
    
    // Close mobile menu when clicking on a navigation link
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });
    });
    
    // Form handling
    const bookingForm = document.getElementById("bookingForm");
    
    // Gallery slider functionality
    const galleryItems = document.querySelectorAll(".gallery-item");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    let currentSlide = 0;
    let itemsToShow = window.innerWidth < 768 ? 1 : 3;
    
    // Initially setup gallery
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
                    // Extract the design ID
                    const designId = designIdElement.textContent;
                    
                    // Scroll to booking section
                    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
                    
                    // Set the design ID in the form with a small delay
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
                    }, 800);
                }
            });
        });
    }
    
    // Next slide function
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentSlide++;
            if (currentSlide > galleryItems.length - itemsToShow) {
                currentSlide = 0;
            }
            updateGallery();
        });
    }
    
    // Previous slide function
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = galleryItems.length - itemsToShow;
            }
            updateGallery();
        });
    }
    
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
    const autoSlideInterval = setInterval(() => {
        currentSlide++;
        if (currentSlide > galleryItems.length - itemsToShow) {
            currentSlide = 0;
        }
        updateGallery();
    }, 5000);
    
    // Pause auto-slide when user interacts with gallery
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
        prevBtn.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
    }
    
    // Window resize event to adjust visible items
    window.addEventListener("resize", () => {
        const newItemsToShow = window.innerWidth < 768 ? 1 : 3;
        if (newItemsToShow !== itemsToShow) {
            itemsToShow = newItemsToShow;
            currentSlide = 0;
            setupGallery();
        }
    });

    // ✅ FAQ Functionality
    const faqItems = document.querySelectorAll(".faq-item");
    
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        
        // Set initial heights for smooth transitions
        if (answer) {
            answer.style.maxHeight = "0px";
        }
        
        if (question) {
            question.addEventListener("click", function() {
                // Toggle active class
                item.classList.toggle("active");
                
                // Toggle icon
                const icon = this.querySelector("i");
                if (icon) {
                    if (item.classList.contains("active")) {
                        icon.classList.remove("fa-chevron-down");
                        icon.classList.add("fa-chevron-up");
                        answer.style.maxHeight = answer.scrollHeight + "px";
                    } else {
                        icon.classList.remove("fa-chevron-up");
                        icon.classList.add("fa-chevron-down");
                        answer.style.maxHeight = "0px";
                    }
                }
                
                // Close other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains("active")) {
                        otherItem.classList.remove("active");
                        const otherIcon = otherItem.querySelector(".faq-question i");
                        const otherAnswer = otherItem.querySelector(".faq-answer");
                        
                        if (otherIcon) {
                            otherIcon.classList.remove("fa-chevron-up");
                            otherIcon.classList.add("fa-chevron-down");
                        }
                        
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = "0px";
                        }
                    }
                });
            });
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

            // ✅ Enhanced Validation
            if (name === "" || contact === "" || date === "") {
                alert("Please fill in all required fields.");
                return;
            }

            if (!/^\d{10}$/.test(contact)) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }
            
            // Validate date is in the future
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert("Please select a future date for your booking.");
                return;
            }

            // ✅ Generate Current Date & Time
            const bookingTime = new Date().toLocaleString();

            console.log("📩 Booking Details:", name, contact, date, message, bookingTime);

            // Show loading state
            const submitBtn = bookingForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Processing...";
            submitBtn.disabled = true;

            // ✅ Store Data in Firebase Database
            push(ref(database, "bookings/"), {
                name: name,
                contact: contact,
                date: date,
                message: message,
                design_id: design_id,
                time: bookingTime,
                status: "pending"
            }).then(() => {
                console.log("✅ Booking added successfully!");
                alert("🎉 Booking Successful! We will contact you soon to confirm.");
                bookingForm.reset();
                
                // Restore button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }).catch((error) => {
                console.error("❌ Error adding booking:", error);
                alert("Booking failed. Please try again later.");
                
                // Restore button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    } else {
        console.error("❌ Booking form not found on the page.");
    }

    // Enable touch swipe for gallery on mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const galleryContainer = document.querySelector(".gallery-container");
    if (galleryContainer) {
        galleryContainer.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        galleryContainer.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            if (nextBtn) nextBtn.click();
        }
        
        if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            if (prevBtn) prevBtn.click();
        }
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

    /* Mobile optimization helper classes */
    @media (max-width: 768px) {
        .faq-question h3 {
            font-size: 16px;
            line-height: 1.4;
        }
        
        .faq-answer {
            transition: max-height 0.3s ease-out;
            overflow: hidden;
        }
    }
    </style>
`);
