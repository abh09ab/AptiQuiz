/* ==============================================================================
   CODOMAX DIGITAL INTERNSHIP - MODULE 4: JAVASCRIPT LOGIC
   Author: Abhay Srivastava (B.Tech)
   Features: Theme Toggle, Mobile Drawer, Form Validation, Scroll Observers,
             Resume Modal & Download Handlers
   ============================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. THEME TOGGLE
  const themeToggle = document.getElementById("themeToggle");
  const htmlRoot = document.documentElement;
  const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
  htmlRoot.setAttribute("data-theme", savedTheme);

  themeToggle?.addEventListener("click", () => {
    const currentTheme = htmlRoot.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlRoot.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio_theme", newTheme);
  });

  // 2. MOBILE HAMBURGER & DRAWER
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

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

  // 3. ACTIVE NAV LINK ON SCROLL
  const sections = document.querySelectorAll("section[id]");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );
  sections.forEach((sec) => sectionObserver.observe(sec));

  // 4. SCROLL REVEAL ANIMATIONS
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

  // 5. ANIMATED STAT COUNTERS
  const counterElements = document.querySelectorAll(".count-target");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target"), 10) || 0;
          let current = 0;
          const duration = 1200;
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

  // 6. RESUME MODAL & DOWNLOAD (MODULE 4)
  const resumeModal = document.getElementById("resumeModal");
  const btnOpenResume = document.getElementById("btnOpenResume");
  const btnHeroResume = document.getElementById("btnHeroResume");
  const btnCloseResume = document.getElementById("btnCloseResume");
  const btnCloseResumeFooter = document.getElementById("btnCloseResumeFooter");

  const openResume = () => {
    resumeModal?.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeResume = () => {
    resumeModal?.classList.remove("active");
    document.body.style.overflow = "";
  };

  btnOpenResume?.addEventListener("click", openResume);
  btnHeroResume?.addEventListener("click", openResume);
  btnCloseResume?.addEventListener("click", closeResume);
  btnCloseResumeFooter?.addEventListener("click", closeResume);

  resumeModal?.addEventListener("click", (e) => {
    if (e.target === resumeModal) closeResume();
  });

  // 7. CONTACT FORM VALIDATION
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const subjectInput = document.getElementById("contactSubject");
  const messageInput = document.getElementById("contactMessage");
  const formAlert = document.getElementById("formAlert");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const setError = (groupId, errorId, msg) => {
    const group = document.getElementById(groupId);
    const errSpan = document.getElementById(errorId);
    if (group && errSpan) {
      group.classList.add("has-error");
      errSpan.innerText = msg;
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

  nameInput?.addEventListener("input", () => clearError("groupName", "nameError"));
  emailInput?.addEventListener("input", () => clearError("groupEmail", "emailError"));
  subjectInput?.addEventListener("input", () => clearError("groupSubject", "subjectError"));
  messageInput?.addEventListener("input", () => clearError("groupMessage", "messageError"));

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError("groupName", "nameError", "Please enter your full name (min 2 characters).");
      isValid = false;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      setError("groupEmail", "emailError", "Please enter a valid email address.");
      isValid = false;
    }

    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      setError("groupSubject", "subjectError", "Please enter a subject (min 3 characters).");
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError("groupMessage", "messageError", "Please write a message of at least 10 characters.");
      isValid = false;
    }

    if (isValid) {
      formAlert.className = "form-feedback-alert success";
      formAlert.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>Thank you, <strong>${nameInput.value.trim()}</strong>! Your message has been sent successfully.</span>
      `;
      formAlert.style.display = "block";
      contactForm.reset();
      setTimeout(() => (formAlert.style.display = "none"), 6000);
    }
  });
});
