document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los elementos con la clase "counter"
    var counters = document.querySelectorAll('.counter');

    // Crear un observador
    var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            // Si el elemento es visible en la pantalla
            if (entry.isIntersecting) {
                // Obtener el valor final del contador
                var targetCount = parseInt(entry.target.innerText);

                // Iniciar el contador desde 0 hasta el valor final
                var startCount = 0;
                var interval = setInterval(function() {
                    entry.target.innerText = startCount;
                    startCount++;
                    if (startCount > targetCount) {
                        clearInterval(interval);
                    }
                }, 20);

                // Dejar de observar el elemento después de iniciar la animación
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Umbral de intersección del 50%

    // Observar cada elemento con la clase "counter"
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
});

(function() {
	var $body = document.body
	, $menu_trigger = $body.getElementsByClassName('menu-trigger')[0];

	if ( typeof $menu_trigger !== 'undefined' ) {
		$menu_trigger.addEventListener('click', function() {
			$body.className = ( $body.className == 'menu-active' )? '' : 'menu-active';
		});
	}

}).call(this);

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mainMenu = document.getElementById('mainMenu');

    hamburgerMenu.addEventListener('click', function() {
        navbar.classList.toggle('hide-navbar');
        mainMenu.classList.toggle('show-menu');
    });
});

// selector
var menu = document.querySelector('.hamburger');

// method
function toggleMenu (event) {
  this.classList.toggle('is-active');
  document.querySelector( ".menuppal" ).classList.toggle("is_active");
  event.preventDefault();
}

// event
menu.addEventListener('click', toggleMenu, false);



