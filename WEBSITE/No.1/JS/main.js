function expandImage(element) {
    var imageUrl = element.src;
    var expandedImageContainer = document.getElementById('expandedImageContainer');
    var expandedImage = document.getElementById('expandedImage');
    expandedImage.src = imageUrl;
    expandedImageContainer.style.display = 'flex';
}

function closeImage() {
    var expandedImageContainer = document.getElementById('expandedImageContainer');
    expandedImageContainer.style.display = 'none';
}
document.addEventListener("DOMContentLoaded", function() {
    var videos = document.querySelectorAll(".demos video");

    function playVideoInView() {
        var isInView = function(element) {
            var bounding = element.getBoundingClientRect();
            return (
                bounding.top >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
        };

        videos.forEach(function(video) {
            if (isInView(video)) {
                video.play();
            } else {
                video.pause();
            }
        });
    }

    window.addEventListener("scroll", playVideoInView);
    window.addEventListener("resize", playVideoInView);

    // Reproduce los videos que están en la vista al cargar la página
    playVideoInView();
});


$(document).ready(function(){
    $('.carousel').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 1
            }
          }
        ]
      });
});
