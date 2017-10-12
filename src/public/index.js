const slowDown = (proximity) => {
    const speed = proximity / 200.0;
    return !Number.isFinite(speed) || speed < 0 ? 0 : speed;
};

const speedUp = (proximity) => {
    const speed = 150 / proximity;
    return !Number.isFinite(speed) || speed < 0 ? 0 : speed;
};

const fadeIn = (element, target) => {
    let tick = () => {
        element.style.opacity = +element.style.opacity + 0.01;

        if (+element.style.opacity < target) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }
    };
    tick();
};

const fadeOut = (element) => {
    let tick = () => {
        element.style.opacity = +element.style.opacity - 0.01;

        if (+element.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }
    };
    tick();
};

const videos = [
    {src: 'video/video3.mp4', f: slowDown},
    {src: 'video/video1.mp4', f: speedUp}
];

window.onload = () => {
    const socket = io('http://localhost:3000');
    const video = document.getElementsByTagName('video')[0];
    const source = video.getElementsByTagName('source')[0];
    const overlays = document.getElementsByClassName('overlay');
    for (let overlay of overlays) {
        overlay.style.opacity = 0;
    }
    let overlaysUp = false;
    let i = 0;
    source.setAttribute('src', videos[i].src);
    video.load();
    video.play();

    video.addEventListener('ended', () => {
        if(i < videos.length - 1) {
            i++;
        } else {
            i = 0;
        }
        source.setAttribute('src', videos[i].src);
        video.load();
        video.play();
    }, true);

    socket.on('ping', (data) => {
        const cm = data.cm < 20 ? 20 : data.cm;
        if(cm < 70 && overlaysUp === false) {
            fadeIn(overlays[0], 0.8);
            fadeIn(overlays[1], 0.8);
            fadeIn(overlays[2], 0.8);
            overlaysUp = true;
        } else if(overlaysUp === true && cm > 100) {
            fadeOut(overlays[0]);
            fadeOut(overlays[1]);
            fadeOut(overlays[2]);
            overlaysUp = false;
        }
        video.playbackRate = videos[i].f(cm);
    });
};

