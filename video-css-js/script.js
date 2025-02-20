document.addEventListener("DOMContentLoaded", function () {
    const mainVideo = document.getElementById("mainVideo");
    const miniPlayer = document.getElementById("miniPlayer");
    const miniVideo = document.getElementById("miniVideo");
    const playPauseMini = document.getElementById("playPauseMini");
    const expandMini = document.getElementById("expandMini");
    const closeMini = document.getElementById("closeMini");
    const playButton = document.getElementById("playButton");
    const videoOverlay = document.getElementById("videoOverlay");
    const progressBar = document.getElementById("miniProgressBar");
    let hasPlayed = false;

    mainVideo.addEventListener("loadeddata", () => console.log("Video loaded successfully."));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasPlayed) {
                mainVideo.play().catch(console.error);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(mainVideo);

    playButton.addEventListener("click", () => {
        if (mainVideo.paused) {
            mainVideo.currentTime = 0;
            mainVideo.play().catch(console.error);
            hasPlayed = true;
        } else {
            mainVideo.pause();
        }
    });

    mainVideo.addEventListener("play", () => {
        videoOverlay.style.opacity = "0";
        videoOverlay.style.pointerEvents = "none";
    });
    
    mainVideo.addEventListener("pause", () => {
        videoOverlay.style.opacity = "1";
        videoOverlay.style.pointerEvents = "auto";
    });

    mainVideo.addEventListener("fullscreenchange", () => {
        mainVideo.controls = !!document.fullscreenElement;
    });

    window.addEventListener("scroll", () => {
        const videoRect = mainVideo.getBoundingClientRect();
        const shouldShowMini = videoRect.bottom <= 0 && !mainVideo.paused;
        miniPlayer.style.display = shouldShowMini ? "block" : "none";
        if (shouldShowMini) {
            miniVideo.src = mainVideo.currentSrc;
            miniVideo.currentTime = mainVideo.currentTime;
            miniVideo.play().catch(console.error);
        } else {
            miniVideo.pause();
        }
    });

    playPauseMini.addEventListener("click", () => {
        const isPaused = miniVideo.paused;
        miniVideo[isPaused ? "play" : "pause"]();
        playPauseMini.innerHTML = `<i class="fas fa-${isPaused ? "pause" : "play"}"></i>`;
    });

    expandMini.addEventListener("click", () => {
        miniPlayer.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
        mainVideo.currentTime = miniVideo.currentTime;
        mainVideo.play();
    });

    closeMini.addEventListener("click", () => {
        miniPlayer.style.display = "none";
        miniVideo.pause();
    });

    miniVideo.addEventListener("timeupdate", () => {
        progressBar.style.width = (miniVideo.currentTime / miniVideo.duration) * 100 + "%";
    });

    mainVideo.parentElement.addEventListener("mouseenter", () => {
        if (mainVideo.paused) showOverlay(true);
    });
    mainVideo.parentElement.addEventListener("mouseleave", () => showOverlay(false));

    function showOverlay(visible) {
        videoOverlay.style.opacity = visible ? "1" : "0";
        videoOverlay.style.pointerEvents = visible ? "auto" : "none";
    }
});
