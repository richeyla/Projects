(function () {
  const els = document.querySelectorAll('.ab-reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings that appear together
          const siblings = entry.target.closest('.ab-pricing, .ab-stats, .ab-hero')
            ?.querySelectorAll('.ab-reveal:not(.visible)') ?? [];
          const idx = [...siblings].indexOf(entry.target);
          const delay = idx > 0 ? idx * 120 : 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  els.forEach(el => io.observe(el));
})();
