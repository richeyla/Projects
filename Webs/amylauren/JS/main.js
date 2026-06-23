/* ---------- Lightbox ---------- */
function expandImage(element) {
    document.getElementById('expandedImage').src = element.src;
    document.getElementById('expandedImageContainer').style.display = 'flex';
}
function closeImage() {
    document.getElementById('expandedImageContainer').style.display = 'none';
}
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeImage();
});

/* ---------- DOMContentLoaded ---------- */
document.addEventListener('DOMContentLoaded', function () {

    /* ---- Navbar scroll + hamburger ---- */
    const navbar    = document.getElementById('navbar');
    const menuBtn   = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
        /* Cerrar menú al hacer click en un link */
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
            });
        });
    }

    /* ---- Videos: play overlay ---- */
    const demoVideos = document.querySelectorAll('.demos video');

    demoVideos.forEach(function (video) {
        const wrapper = document.createElement('div');
        wrapper.className = 'video-item';
        video.parentNode.insertBefore(wrapper, video);
        wrapper.appendChild(video);

        const overlay = document.createElement('div');
        overlay.className = 'play-overlay';
        overlay.innerHTML = '<div class="play-btn"><span></span></div>';
        wrapper.appendChild(overlay);

        overlay.addEventListener('click', function () {
            video.play();
            overlay.classList.add('hidden');
        });
        video.addEventListener('pause',  function () { overlay.classList.remove('hidden'); });
        video.addEventListener('ended',  function () { overlay.classList.remove('hidden'); });
        video.addEventListener('play',   function () { overlay.classList.add('hidden'); });
    });

    /* ---- Slick carousel ---- */
    if (typeof $.fn.slick !== 'undefined') {
        $('.carousel').slick({
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
            responsive: [
                { breakpoint: 768, settings: { arrows: false, centerMode: true, centerPadding: '40px', slidesToShow: 2 } },
                { breakpoint: 480, settings: { arrows: false, centerMode: true, centerPadding: '30px', slidesToShow: 1 } }
            ]
        });
    }
});
