/* ==============================================================================
   CODOMAX DIGITAL INTERNSHIP - MODULE 6: MASTER PRODUCTION JAVASCRIPT
   Author: Abhay Srivastava (B.Tech Computer Science & Engineering)
   GitHub: https://github.com/abh09ab
   Features:
     1. Dark/Light Theme Switching with LocalStorage State Persistence
     2. Responsive Mobile Drawer Navigation with Overlay Backdrop
     3. IntersectionObserver Section Spy for Dynamic Active Nav Highlighting
     4. IntersectionObserver Scroll Reveal Animations
     5. Animated Number Counters for Stats Section
     6. Interactive Resume Modal with 1-Click Resume Download
     7. 1-Click Clipboard Email Copy with Visual Tooltip Feedback
     8. Client-Side Contact Form Validation with Error & Success Alerts
   ============================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. THEME SWITCHING (DARK / LIGHT MODE)
  const themeToggle = document.getElementById("themeToggle");
  const htmlRoot = document.documentElement;
  const savedTheme = localStorage.getItem("codomax_portfolio_theme") || "dark";
  htmlRoot.setAttribute("data-theme", savedTheme);

  themeToggle?.addEventListener("click", () => {
    const currentTheme = htmlRoot.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlRoot.setAttribute("data-theme", newTheme);
    localStorage.setItem("codomax_portfolio_theme", newTheme);
  });

  // 2. MOBILE HAMBURGER MENU & DRAWER
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const drawerOverlay = document.getElementById("drawerOverlay");

  const toggleMobileMenu = () => {
    menuToggle?.classList.toggle("active");
    navMenu?.classList.toggle("open");
    drawerOverlay?.classList.toggle("active");
    document.body.style.overflow = navMenu?.classList.contains("open") ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    menuToggle?.classList.remove("active");
    navMenu?.classList.remove("open");
    drawerOverlay?.classList.remove("active");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", toggleMobileMenu);
  drawerOverlay?.addEventListener("click", closeMobileMenu);

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

  // 3. INTERSECTION OBSERVER FOR ACTIVE NAVBAR LINKS
  const sections = document.querySelectorAll("section[id]");
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${currentId}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );
  sections.forEach((section) => navObserver.observe(section));

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
          const duration = 1400;
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

  // 6. RESUME MODAL & DOWNLOAD
  const resumeModal = document.getElementById("resumeModal");
  const btnOpenResume = document.getElementById("btnOpenResume");
  const btnHeroResume = document.getElementById("btnHeroResume");
  const btnCloseResume = document.getElementById("btnCloseResume");
  const btnCloseResumeFooter = document.getElementById("btnCloseResumeFooter");

  const openResumeModal = () => {
    resumeModal?.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeResumeModal = () => {
    resumeModal?.classList.remove("active");
    document.body.style.overflow = "";
  };

  btnOpenResume?.addEventListener("click", openResumeModal);
  btnHeroResume?.addEventListener("click", openResumeModal);
  btnCloseResume?.addEventListener("click", closeResumeModal);
  btnCloseResumeFooter?.addEventListener("click", closeResumeModal);

  resumeModal?.addEventListener("click", (e) => {
    if (e.target === resumeModal) closeResumeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && resumeModal?.classList.contains("active")) {
      closeResumeModal();
    }
  });

  // 7. CLICK-TO-COPY EMAIL (WITH VISUAL FEEDBACK)
  const copyEmailTrigger = document.getElementById("copyEmailTrigger");
  const copyTooltip = document.getElementById("copyTooltip");
  const emailToCopy = "abhaysrivastava22sr@gmail.com";

  copyEmailTrigger?.addEventListener("click", () => {
    navigator.clipboard.writeText(emailToCopy).then(() => {
      if (copyTooltip) {
        copyTooltip.innerText = "Copied! ✓";
        copyTooltip.style.background = "#10b981";
        copyTooltip.style.color = "#ffffff";
        setTimeout(() => {
          copyTooltip.innerText = "Copy";
          copyTooltip.style.background = "";
          copyTooltip.style.color = "";
        }, 2200);
      }
    });
  });

  // 8. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const subjectInput = document.getElementById("contactSubject");
  const messageInput = document.getElementById("contactMessage");
  const formAlert = document.getElementById("formAlert");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim().toLowerCase());
  };

  const setFieldError = (groupId, errorId, message) => {
    const group = document.getElementById(groupId);
    const errSpan = document.getElementById(errorId);
    if (group && errSpan) {
      group.classList.add("has-error");
      errSpan.innerText = message;
    }
  };

  const clearFieldError = (groupId, errorId) => {
    const group = document.getElementById(groupId);
    const errSpan = document.getElementById(errorId);
    if (group && errSpan) {
      group.classList.remove("has-error");
      errSpan.innerText = "";
    }
  };

  nameInput?.addEventListener("input", () => clearFieldError("groupName", "nameError"));
  emailInput?.addEventListener("input", () => clearFieldError("groupEmail", "emailError"));
  subjectInput?.addEventListener("input", () => clearFieldError("groupSubject", "subjectError"));
  messageInput?.addEventListener("input", () => clearFieldError("groupMessage", "messageError"));

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (!nameInput?.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError("groupName", "nameError", "Please enter your name (at least 2 characters).");
      isValid = false;
    }

    if (!emailInput?.value.trim() || !validateEmail(emailInput.value.trim())) {
      setFieldError("groupEmail", "emailError", "Please provide a valid email address.");
      isValid = false;
    }

    if (!subjectInput?.value.trim() || subjectInput.value.trim().length < 3) {
      setFieldError("groupSubject", "subjectError", "Please enter a subject (at least 3 characters).");
      isValid = false;
    }

    if (!messageInput?.value.trim() || messageInput.value.trim().length < 10) {
      setFieldError("groupMessage", "messageError", "Your message must be at least 10 characters long.");
      isValid = false;
    }

    if (isValid && formAlert) {
      const senderName = nameInput.value.trim();
      formAlert.className = "form-feedback-alert success";
      formAlert.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>Thank you, <strong>${senderName}</strong>! Your inquiry has been sent successfully. I will respond to you shortly!</span>
      `;
      formAlert.style.display = "block";
      contactForm.reset();
      setTimeout(() => {
        formAlert.style.display = "none";
      }, 6500);
    }
  });
});
