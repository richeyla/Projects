$(document).ready(function () {

    // ---- Posiciones de secciones ----
    function getOffsets() {
        return {
            acercaDe: $('#acerca-de').offset().top,
            menu: $('#platillo').offset().top,
            galeria: $('#galeria').offset().top,
            ubicacion: $('#ubicacion').offset().top
        };
    }

    // ---- Scroll suave (nav links) ----
    $('#btn-acerca-de').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: getOffsets().acercaDe - 80 }, 500);
        closeMenu();
    });

    $('#btn-menu, #btn-menu-cta').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: getOffsets().menu - 80 }, 500);
        closeMenu();
    });

    $('#btn-galeria').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: getOffsets().galeria - 80 }, 500);
        closeMenu();
    });

    $('#btn-ubicacion').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: getOffsets().ubicacion - 80 }, 500);
        closeMenu();
    });

    // ---- Hamburger menu ----
    $('#hamburger').on('click', function () {
        $(this).toggleClass('open');
        $('#nav-links').toggleClass('open');
    });

    function closeMenu() {
        $('#hamburger').removeClass('open');
        $('#nav-links').removeClass('open');
    }

    // ---- Navbar: fondo al hacer scroll + scroll spy ----
    $(window).on('scroll', function () {
        var scrollY = $(this).scrollTop();
        var o = getOffsets();

        // Fondo navbar
        if (scrollY > 60) {
            $('#navbar').addClass('scrolled');
        } else {
            $('#navbar').removeClass('scrolled');
        }

        // Scroll spy
        var links = $('#nav-links a');
        links.removeClass('active');

        if (scrollY >= o.ubicacion - 120) {
            $('#btn-ubicacion').addClass('active');
        } else if (scrollY >= o.galeria - 120) {
            $('#btn-galeria').addClass('active');
        } else if (scrollY >= o.menu - 120) {
            $('#btn-menu').addClass('active');
        } else if (scrollY >= o.acercaDe - 120) {
            $('#btn-acerca-de').addClass('active');
        }

        // Scroll-to-top button
        if (scrollY > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // ---- Scroll-to-top ----
    $('.scroll-to-top').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    // ---- Fade-in al hacer scroll (IntersectionObserver) ----
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
        observer.observe(el);
    });

    // ---- Animación entrada nav links ----
    $('#nav-links a').each(function (index, el) {
        $(el).css({ opacity: 0, top: '-20px', position: 'relative' });
        $(el).delay(index * 150).animate({ opacity: 1, top: '0' }, 600);
    });

    // ---- Animación entrada hero ----
    if ($(window).width() > 800) {
        $('header .texto').css({ opacity: 0, marginTop: 0 });
        $('header .texto').animate({ opacity: 1, marginTop: '-52px' }, 1500);
    }

});
