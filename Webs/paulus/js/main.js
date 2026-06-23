const videos = document.querySelectorAll('.demos video');
    const videoContainer = document.getElementById('videoContainer');
    const largeVideo = document.getElementById('largeVideo');

    videos.forEach(video => {
        video.addEventListener('click', () => {
            const src = video.getAttribute('src');
            largeVideo.setAttribute('src', src);
            videoContainer.classList.add('show');
        });
    });


    



