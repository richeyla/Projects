document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.menu a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
        const targetId = this.getAttribute('href').substring(1); // Elimina el "#" del href
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
            behavior: 'smooth'
            });
        }
    });
});
});

var checks = document.querySelectorAll(".check");
checks.forEach(check => {
    check.addEventListener('click', idioma);
});

function idioma(event) {
    event.preventDefault(); // Evita que el enlace realice su acción predeterminada

    var lang = this.getAttribute('data-lang');

    switch (lang) {
        case 'en':
            location.href = "/practicas/portafolio/HTML/en.html";
            break;
        case 'es':
            location.href = "/practicas/portafolio/index.html";
            break;
        default:
            break;
    }
}


