(() => {
  const lightbox = document.getElementById("lightbox");
  const wrapper = document.getElementById("swiperWrapper");
  const lbLogo = document.getElementById("lbLogo");
  if (!lightbox || !wrapper || !lbLogo) return;

  // ✅ Media por marca
  const BRAND_MEDIA = {
    edhardy: [
      { type: "image", src: "assets/images/ed hardy foto.jpg" },
      { type: "video", src: "assets/images/ed hardy video.mp4" },
      { type: "video", src: "assets/images/ed hardy video 2.mp4" },
    ],

    fubu: [
      { type: "image", src: "assets/images/fubu fotos.jpg" },
      { type: "video", src: "assets/images/fubu video.mp4" },
    ],

    madrag: [
      { type: "image", src: "assets/images/madrag foto.jpg" },
      { type: "video", src: "assets/images/madrag video (1).mp4" },
      { type: "video", src: "assets/images/madrag video (2).mp4" },
      { type: "video", src: "assets/images/madrag video (3).mp4" },
      { type: "video", src: "assets/images/madrag video (4).mp4" },
      { type: "video", src: "assets/images/madrag video (5).mp4" },
    ],

    neewer: [
      { type: "image", src: "assets/images/neewer foto.jpg" },
      { type: "video", src: "assets/images/neewer video.mp4" },
      { type: "video", src: "assets/images/neewer video 2.mp4" },
      { type: "video", src: "assets/images/neewer video 3.mp4" },
      { type: "video", src: "assets/images/neewer video 4.mp4" },
    ],

    diginn: [
      { type: "image", src: "assets/images/dig inn foto.jpg" },
      { type: "video", src: "assets/images/dig inn video.mp4" },
    ],

    stevesandeds: [
      { type: "image", src: "assets/images/stevesandeds fotos.jpg" },
      { type: "video", src: "assets/images/stevesandeds fotos.mp4" },
      { type: "video", src: "assets/images/stevesandeds video.mp4" },
    ],

    minutemaid: [
      { type: "image", src: "assets/images/minute maid (1).jpg" },
      { type: "image", src: "assets/images/minute maid (2).jpg" },
      { type: "image", src: "assets/images/minute maid (3).jpg" },
      { type: "video", src: "assets/images/minute maid video.mp4" },
      { type: "video", src: "assets/images/minute maid video 2.mp4" },
    ],

    tribit: [
      { type: "image", src: "assets/images/tribit foto.jpg" },
      { type: "video", src: "assets/images/tribit video.mp4" },
      { type: "video", src: "assets/images/tribit video 2.mp4" },
    ],

    harborhouse: [
      { type: "image", src: "assets/images/harbor house foto.jpg" },
      { type: "video", src: "assets/images/harbor house videos.mp4" },
    ],

    carrera: [
      { type: "image", src: "assets/images/carrera foto.jpg" },
      { type: "video", src: "assets/images/carrera video.mp4" },
      { type: "video", src: "assets/images/carrera video 2.mp4" },
    ],

    limitedtoo: [
      { type: "image", src: "assets/images/limited too foto (1).jpg" },
      { type: "image", src: "assets/images/limited too foto (2).jpg" },
      { type: "image", src: "assets/images/limited too foto (3).jpg" },
      { type: "image", src: "assets/images/limited too foto (4).jpg" },
      { type: "image", src: "assets/images/limited too foto (5).jpg" },
      { type: "image", src: "assets/images/limited too foto (6).jpg" },
      { type: "image", src: "assets/images/limited too foto (7).jpg" },
    ],

    baleaf: [
      { type: "image", src: "assets/images/baleaf foto.jpg" },
      { type: "video", src: "assets/images/baleaf video.mp4" },
    ],

    raeli: [
      { type: "image", src: "assets/images/raeli brand foto.jpg" },
      { type: "video", src: "assets/images/raeli brand video.mp4" },
    ],

    cape: [
      { type: "image", src: "assets/images/Caperobbin (1).jpg" },
      { type: "image", src: "assets/images/Caperobbin (2).jpg" },
      { type: "image", src: "assets/images/Caperobbin (3).jpg" },
      { type: "image", src: "assets/images/Caperobbin (4).jpg" },
      { type: "image", src: "assets/images/Caperobbin (5).jpg" },
      { type: "image", src: "assets/images/Caperobbin (6).jpg" },
      { type: "image", src: "assets/images/Caperobbin (7).jpg" },
    ],
  };

  let swiper = null;

  function buildSlides(items) {
    wrapper.innerHTML = "";

    items.forEach((item) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";

      const frame = document.createElement("div");
      frame.className = "media-frame";

      if (item.type === "video") {
        const video = document.createElement("video");
        video.src = item.src;
        video.controls = true;
        video.playsInline = true;

        // ✅ Clave para autoplay en casi todos los navegadores
        video.muted = true;
        video.preload = "metadata";

        frame.appendChild(video);
      } else {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = "Brand media";
        frame.appendChild(img);
      }

      slide.appendChild(frame);
      wrapper.appendChild(slide);
    });
  }

  function pauseAllVideos() {
    document.querySelectorAll("#brandSwiper video").forEach((v) => {
      v.pause();
      // opcional: reiniciar al inicio
      // v.currentTime = 0;
    });
  }

  async function playActiveVideo() {
    if (!swiper) return;

    // Pausa todos primero
    pauseAllVideos();

    // Busca el video del slide activo (si existe)
    const activeSlide = swiper.slides[swiper.activeIndex];
    if (!activeSlide) return;

    const video = activeSlide.querySelector("video");
    if (!video) return;

    try {
      // intenta reproducir
      await video.play();
    } catch (err) {
      // Si el navegador bloquea autoplay (raro si muted), no hacemos nada
      // el usuario puede darle play manual.
      // console.log("Autoplay bloqueado:", err);
    }
  }

  function openCarousel(brandKey, logoSrc) {
    const items = BRAND_MEDIA[brandKey] || [];
    if (!items.length) return;

    lbLogo.src = logoSrc;
    buildSlides(items);

    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Destruye anterior
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }

// Inicia Swiper
    swiper = new Swiper("#brandSwiper", {
      loop: true,
      loopAdditionalSlides: 1,   // ✅ más suave en loop
      watchSlidesProgress: true, // ✅ evita glitches al clonar
      spaceBetween: 12,

      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },

      // ✅ Video control
      on: {
        init() {
          playActiveVideo();
        },
        slideChangeTransitionStart() {
          pauseAllVideos();
        },
        slideChangeTransitionEnd() {
          playActiveVideo();
        },
      },
    });
  }

  function closeCarousel() {
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // ✅ Pausa todo al cerrar
    pauseAllVideos();

    wrapper.innerHTML = "";
    lbLogo.removeAttribute("src");

    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
  }

  // Abrir / cerrar
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".brand-card--cover");
    if (card) {
      const brand = card.dataset.brand;
      const logo = card.dataset.logo;
      openCarousel(brand, logo);
      return;
    }

    if (e.target.matches("[data-close]")) closeCarousel();
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") {
      closeCarousel();
    }
  });
})();
