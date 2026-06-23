/* =====================================================
   GENACY PRODUCTIONS – MAIN JS
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     1. Smooth Scroll
     ------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetID = this.getAttribute("href");
      if (targetID && targetID.length > 1) {
        const targetEl = document.querySelector(targetID);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

  /* -------------------------
     2. Navbar Shrink on Scroll
     ------------------------- */
  const header = document.querySelector(".site-header");

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add("shrink-header");
    } else {
      header.classList.remove("shrink-header");
    }
  }

  window.addEventListener("scroll", updateHeader);
  updateHeader(); // estado inicial

/* -------------------------
   2b. Mobile Menu Toggle
   ------------------------- */
const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function closeMobileMenu() {
  navToggle.classList.remove("open");
  mobileMenu.classList.remove("open");
}

if (navToggle && mobileMenu) {
  // Abrir / cerrar con el botón hamburguesa
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // que este clic no cuente como "click fuera"
    navToggle.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  // Cerrar al hacer clic en un enlace del menú
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // 🔹 Cerrar al hacer clic fuera del menú
  document.addEventListener("click", (e) => {
    // Si el menú no está abierto, no hacemos nada
    if (!mobileMenu.classList.contains("open")) return;

    const clickDentroMenu = mobileMenu.contains(e.target);
    const clickEnToggle  = navToggle.contains(e.target);

    // Si el clic NO es dentro del menú ni en el botón hamburguesa → cerrar
    if (!clickDentroMenu && !clickEnToggle) {
      closeMobileMenu();
    }
  });
}


  /* -------------------------
     3. Fade-In Animation for Sections
     ------------------------- */
  const observerOptions = {
    threshold: 0.15
  };

  const fadeElements = document.querySelectorAll(
    ".featured-section, .cta-section, .about-content, .pricing-section, .contact-section, .films-grid, .film-detail-video-section"
  );

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => {
    el.classList.add("fade-init");
    fadeObserver.observe(el);
  });

  /* -------------------------
     4. Hero video tipo "GIF"
        - mute, loop
        - solo reproduce cuando está visible
     ------------------------- */
  const heroVideo = document.querySelector(".hero-video");
  const heroSection = document.querySelector(".hero-section");

  if (heroVideo) {
    // Aseguramos que esté muteado
    heroVideo.muted = true;

    // Observer para reproducir / pausar según visibilidad
    if (heroSection) {
      const heroObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // En pantalla → reproducir
              heroVideo
                .play()
                .catch(() => {
                  heroVideo.muted = true;
                  heroVideo.play().catch(() => {});
                });
            } else {
              // Fuera de pantalla → pausar
              heroVideo.pause();
            }
          });
        },
        {
          threshold: 0.35 // ~35% visible para considerarlo "en pantalla"
        }
      );

      heroObserver.observe(heroSection);
    }

    // Pausamos el video si el usuario cambia de pestaña
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        heroVideo.pause();
      } else if (heroSection) {
        // solo intenta reproducir si el hero está visible
        const rect = heroSection.getBoundingClientRect();
        const inView =
          rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;

        if (inView) {
          heroVideo.play().catch(() => {});
        }
      }
    });
  }

  /* -------------------------
     5. Parallax suave en el hero
     ------------------------- */
  const heroFrame = document.querySelector(".hero-media-frame");

  function updateHeroParallax() {
    if (!heroFrame) return;
    const strength = 0.03;
    const offset = window.scrollY * strength;
    heroFrame.style.transform = `translateY(${offset}px)`;
  }

  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateHeroParallax);
  });

  updateHeroParallax();

  /* -------------------------
     6. Fade-in para el logo
     ------------------------- */
  const siteLogo = document.querySelector(".site-logo");
  if (siteLogo) {
    setTimeout(() => {
      siteLogo.classList.add("logo-animate");
    }, 100);
  }

  /* -------------------------
     7. Haptic feel en botones
     ------------------------- */
  const buttons = document.querySelectorAll(".primary-button, .pill-button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.add("btn-pulse");
      setTimeout(() => {
        btn.classList.remove("btn-pulse");
      }, 150);
    });
  });

  /* -------------------------
     8. Resaltar link de página actual
     ------------------------- */
  const navLinks = document.querySelectorAll(
    ".mobile-menu a, .main-nav a"
  );
  const currentPath =
    window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href === currentPath || href.endsWith("/" + currentPath)) {
      link.classList.add("is-current");
    }
  });


    /* -------------------------
     9. Botón de idioma ES / EN
     ------------------------- */
  const langBtn = document.getElementById("lang-toggle");

  if (langBtn) {
    // Idioma actual desde localStorage o inglés por defecto
    let savedLang = localStorage.getItem("site-lang") || "en";

    // Texto inicial del botón
    langBtn.textContent = savedLang.toUpperCase();

    langBtn.addEventListener("click", () => {
      // Alternar idioma
      const newLang = savedLang === "en" ? "es" : "en";
      savedLang = newLang;

      // Llamar a la función global de language.js
      if (window.setLanguage) {
        window.setLanguage(newLang);
      }

      // Actualizar texto del botón
      langBtn.textContent = newLang.toUpperCase();
    });
  }

  /* -------------------------
     10. Preseleccionar servicio en Contact
     ------------------------- */
  const servicesWrapper = document.querySelector(".services-options");
  if (servicesWrapper) {
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service");

    if (selectedService) {
      const checkbox = servicesWrapper.querySelector(
        `input[name="services[]"][value="${selectedService}"]`
      );

      if (checkbox) {
        checkbox.checked = true;
        // Opcional: hacer scroll al bloque de servicios
        servicesWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  /* -------------------------
     11. Formato automático para Phone (XXX)-XXX-XXXX
     ------------------------- */
  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      // Quitar todo lo que no sea número
      let value = e.target.value.replace(/\D/g, "");

      // Limitar a 10 dígitos
      if (value.length > 10) {
        value = value.slice(0, 10);
      }

      let formatted = "";

      if (value.length > 0) {
        formatted = "(" + value.substring(0, 3);
      }
      if (value.length >= 4) {
        formatted += ")-" + value.substring(3, 6);
      }
      if (value.length >= 7) {
        formatted += "-" + value.substring(6, 10);
      }

      e.target.value = formatted;
    });

    // Si el usuario borra todo, evitar que quede solo "("
    phoneInput.addEventListener("blur", () => {
      if (phoneInput.value === "(" || phoneInput.value === "()-" ) {
        phoneInput.value = "";
      }
    });
  }

    /* -------------------------
     12. Formato automático para Budget: $X,XXX
     ------------------------- */
  const budgetInput = document.getElementById("budget");

  if (budgetInput) {
    budgetInput.addEventListener("input", (e) => {
      // Quitar todo lo que no sean números
      let value = e.target.value.replace(/\D/g, "");

      if (value.length === 0) {
        e.target.value = "";
        return;
      }

      // Convertir a número y formatear con comas
      let number = parseInt(value, 10);
      let formatted = number.toLocaleString("en-US");

      // Agregar el signo de dólar
      e.target.value = "$" + formatted;
    });

    // Opcional: si el usuario borra todo, limpiar completamente
    budgetInput.addEventListener("blur", () => {
      if (budgetInput.value === "$") {
        budgetInput.value = "";
      }
    });
  }
});

