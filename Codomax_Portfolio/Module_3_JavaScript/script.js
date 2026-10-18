/* ==============================================================================
   CODOMAX DIGITAL INTERNSHIP - MODULE 3: JAVASCRIPT LOGIC
   Author: Abhay Srivastava (B.Tech)
   Features: Theme Toggle, Mobile Drawer, Form Validation, Scroll Observers
   ============================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  // -------------------------------------------------------------
  const themeToggle = document.getElementById("themeToggle");
  const htmlRoot = document.documentElement;

  // Retrieve saved theme from localStorage or default to dark
  const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
  htmlRoot.setAttribute("data-theme", savedTheme);

  themeToggle?.addEventListener("click", () => {
    const currentTheme = htmlRoot.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    htmlRoot.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio_theme", newTheme);
  });

  // -------------------------------------------------------------
  // 2. MOBILE HAMBURGER MENU & DRAWER
  // -------------------------------------------------------------
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const drawerOverlay = document.getElementById("drawerOverlay");

  const toggleMobileMenu = () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("open");
    drawerOverlay.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("open");
    drawerOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", toggleMobileMenu);
  drawerOverlay?.addEventListener("click", closeMobileMenu);

  // Close mobile drawer when clicking a navigation link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // -------------------------------------------------------------
  // 3. ACTIVE NAV LINK ON SCROLL (INTERSECTION OBSERVER)
  // -------------------------------------------------------------
  const sections = document.querySelectorAll("section[id]");

  const observerOptions = {
    threshold: 0.35,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));

  // -------------------------------------------------------------
  // 4. SCROLL REVEAL ANIMATIONS
  // -------------------------------------------------------------
  const revealElements = document.querySelectorAll(".reveal-item");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // -------------------------------------------------------------
  // 5. ANIMATED NUMBER COUNTERS
  // -------------------------------------------------------------
  const counterElements = document.querySelectorAll(".count-target");

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target"), 10) || 0;
          let current = 0;
          const duration = 1200; // ms
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.innerText = target;
              clearInterval(timer);
            } else {
              el.innerText = Math.floor(current);
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach((el) => counterObserver.observe(el));

  // -------------------------------------------------------------
  // 6. CONTACT FORM VALIDATION & FEEDBACK
  // -------------------------------------------------------------
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const subjectInput = document.getElementById("contactSubject");
  const messageInput = document.getElementById("contactMessage");
  const formAlert = document.getElementById("formAlert");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const setError = (groupId, errorId, message) => {
    const group = document.getElementById(groupId);
    const errSpan = document.getElementById(errorId);
    if (group && errSpan) {
      group.classList.add("has-error");
      errSpan.innerText = message;
    }
  };

  const clearError = (groupId, errorId) => {
    const group = document.getElementById(groupId);
    const errSpan = document.getElementById(errorId);
    if (group && errSpan) {
      group.classList.remove("has-error");
      errSpan.innerText = "";
    }
  };

  // Real-time error clearance on typing
  nameInput?.addEventListener("input", () => clearError("groupName", "nameError"));
  emailInput?.addEventListener("input", () => clearError("groupEmail", "emailError"));
  subjectInput?.addEventListener("input", () => clearError("groupSubject", "subjectError"));
  messageInput?.addEventListener("input", () => clearError("groupMessage", "messageError"));

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError("groupName", "nameError", "Please enter your full name (minimum 2 characters).");
      isValid = false;
    } else {
      clearError("groupName", "nameError");
    }

    // Validate Email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      setError("groupEmail", "emailError", "Please enter a valid email address.");
      isValid = false;
    } else {
      clearError("groupEmail", "emailError");
    }

    // Validate Subject
    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      setError("groupSubject", "subjectError", "Please enter a subject (minimum 3 characters).");
      isValid = false;
    } else {
      clearError("groupSubject", "subjectError");
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError("groupMessage", "messageError", "Please write a message of at least 10 characters.");
      isValid = false;
    } else {
      clearError("groupMessage", "messageError");
    }

    if (isValid) {
      // Simulate successful submission
      formAlert.className = "form-feedback-alert success";
      formAlert.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>Thank you, <strong>${nameInput.value.trim()}</strong>! Your message has been sent successfully. Abhay will get back to you shortly.</span>
      `;
      formAlert.style.display = "block";

      // Reset form
      contactForm.reset();

      // Clear alert after 6 seconds
      setTimeout(() => {
        formAlert.style.display = "none";
      }, 6000);
    }
  });
});
