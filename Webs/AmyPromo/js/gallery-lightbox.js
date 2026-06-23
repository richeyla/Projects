(() => {
  const lightbox = document.getElementById("lightbox");
  const content = document.getElementById("lightboxContent");
  if (!lightbox || !content) return;

  function openMedia(type, src) {
    // Limpia contenido previo (importantísimo para parar videos)
    content.innerHTML = "";

    if (type === "video") {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      content.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Gallery media";
      content.appendChild(img);
    }

    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMedia() {
    lightbox.setAttribute("aria-hidden", "true");
    content.innerHTML = ""; // esto detiene el video
    document.body.style.overflow = "";
  }

  // Abrir al click en cualquier card
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".brand-card");
    if (card) {
      const type = card.dataset.type || "image";
      const src = card.dataset.src;
      if (src) openMedia(type, src);
      return;
    }

    // Cerrar
    if (e.target.matches("[data-close]")) closeMedia();
  });

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") {
      closeMedia();
    }
  });
})();
