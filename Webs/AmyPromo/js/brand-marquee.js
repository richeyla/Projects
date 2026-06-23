(function () {
  const wrapper = document.querySelector("[data-marquee]");
  if (!wrapper) return;

  // Respeta usuarios con reducción de movimiento
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SPEED = 60; // px por segundo

  // Guardamos los elementos originales (logos)
  const originalItems = Array.from(wrapper.children);

  // Creamos la pista
  const track = document.createElement("div");
  track.className = "marquee-track";
  track.style.display = "inline-flex";
  track.style.alignItems = "center";
  track.style.gap = getComputedStyle(wrapper).gap || "48px";
  track.style.willChange = "transform";

  // Metemos el primer set de logos en la pista
  originalItems.forEach((el) => track.appendChild(el));

  // Limpiamos wrapper y metemos la pista
  wrapper.innerHTML = "";
  wrapper.appendChild(track);

  // Estilos necesarios en wrapper
  wrapper.style.overflow = "hidden";
  wrapper.style.whiteSpace = "nowrap";
  wrapper.style.display = "block";

  // Función: duplicar sets hasta que sobrepase el ancho visible (para evitar espacios vacíos)
  function fillToLoop() {
    // Remueve duplicados anteriores dejando solo el primer set
    while (track.children.length > originalItems.length) {
      track.removeChild(track.lastElementChild);
    }

    // Duplicamos hasta llenar mínimo 2x del ancho visible (más suave y sin vacíos)
    const neededWidth = wrapper.getBoundingClientRect().width * 2;
    let safety = 0;

    while (track.getBoundingClientRect().width < neededWidth && safety < 30) {
      originalItems.forEach((el) => track.appendChild(el.cloneNode(true)));
      safety++;
    }
  }

  fillToLoop();

  // Medimos el ancho del “set original” (un ciclo)
  function getCycleWidth() {
    // Creamos medición temporal: sumamos el width de los primeros N items (los originales)
    let width = 0;
    const gapPx = parseFloat(getComputedStyle(track).gap || "0");

    for (let i = 0; i < originalItems.length; i++) {
      const child = track.children[i];
      if (!child) break;
      width += child.getBoundingClientRect().width;
      if (i < originalItems.length - 1) width += gapPx;
    }
    return width || track.getBoundingClientRect().width / 2;
  }

  let cycleW = getCycleWidth();

  let x = 0;
  let last = performance.now();
  let paused = false;

  function step(now) {
    const dt = (now - last) / 1000;
    last = now;

    if (!paused) {
      x -= SPEED * dt;

      // Reinicio sin salto cuando completamos 1 ciclo
      if (Math.abs(x) >= cycleW) x = 0;

      track.style.transform = `translateX(${x}px)`;
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

  // Pausa al hover / touch
  wrapper.addEventListener("mouseenter", () => (paused = true));
  wrapper.addEventListener("mouseleave", () => (paused = false));
  wrapper.addEventListener("touchstart", () => (paused = true), { passive: true });
  wrapper.addEventListener("touchend", () => (paused = false), { passive: true });

  // Recalcular en resize
  const ro = new ResizeObserver(() => {
    x = 0;
    fillToLoop();
    cycleW = getCycleWidth();
  });
  ro.observe(wrapper);
})();
