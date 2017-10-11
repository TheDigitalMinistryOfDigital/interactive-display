const slowdown = (proximity) => {
    const speed = proximity / 200.0;
    let n = !Number.isFinite(speed) || speed < 0 ? 0 : speed;
    console.log(`proximity: ${proximity}  speed: ${speed}`);
    return n;
};

const speedup = (proximity) => {
    const speed = 150 / proximity;
    return !Number.isFinite(speed) || speed < 0 ? 0 : speed;
};

const videos = [
    {src: 'video/video4.mp4', f: slowdown},
    {src: 'video/video3.mp4', f: slowdown},
    {src: 'video/video1.mp4', f: speedup},
    {src: 'video/video2.mp4', f: speedup}
    ];

window.onload = () => {
    const socket = io('http://localhost:3000');
    const video = document.getElementsByTagName('video')[0];
    const source = video.getElementsByTagName('source')[0];
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
        const speed = videos[i].f(cm);
        console.log(speed);
        video.playbackRate = speed;
    });
};
