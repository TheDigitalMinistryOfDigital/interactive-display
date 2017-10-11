const slowdown = (proximity) => {
    let speed = Math.log2(Math.log(proximity));
    return !Number.isFinite(speed) || speed < 0 ? 0 : speed;
};

const speedup = (proximity) => {
    const speed = 150 / proximity;
    return !Number.isFinite(speed) || speed < 0 ? 0 : speed;
};

window.onload = () => {
    const socket = io('http://localhost:3000');
    const video = document.getElementsByTagName('video')[0];
    video.play();
    video.addEventListener('ended', () => { video.play(); }, true);

    socket.on('ping', (data) => {
        const cm = data.cm < 20 ? 20 : data.cm;
        const speed = speedup(cm);
        video.playbackRate = speed;
    });
};
