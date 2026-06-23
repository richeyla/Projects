// ===========================
// AUTO YEAR
// ===========================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ===========================
// FORM ALERTS
// ===========================
(() => {
  const params = new URLSearchParams(window.location.search);
  const okBox  = document.querySelector('[data-alert="success"]');
  const errBox = document.querySelector('[data-alert="error"]');
  if (params.get("sent")  === "1" && okBox)  okBox.hidden  = false;
  if (params.get("error") === "1" && errBox) errBox.hidden = false;
})();

// ===========================
// HEADER: scroll class
// ===========================
const header = document.getElementById("siteHeader");
if (header) {
  const onHeaderScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();
}

// ===========================
// HAMBURGER MENU
// ===========================
const navToggle = document.getElementById("navToggle");
const navLinks  = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close on link click
  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close on outside click
  document.addEventListener("click", e => {
    if (!header || header.contains(e.target)) return;
    if (navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

// ===========================
// SCROLL REVEAL
// ===========================
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach(el => observer.observe(el));
}

// ===========================
// STAT COUNTER ANIMATION
// ===========================
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll(".stat-num[data-count]");
if (statNums.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach(el => counterObserver.observe(el));
}
