(function () {
  const hero = document.getElementById("hero");
  const heroImg = document.getElementById("heroImg");
  if (!hero || !heroImg) return;

  // Mientras más grande sea fadeDistance, más lento se desvanece
  const fadeDistance = 420;

  function onScroll() {
    const rect = hero.getBoundingClientRect();
    const scrolled = Math.max(0, -rect.top); // cuanto hemos bajado dentro del hero
    const progress = Math.min(1, scrolled / fadeDistance);

    // Desvanece imagen (1 -> 0)
    heroImg.style.opacity = String(1 - progress);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
