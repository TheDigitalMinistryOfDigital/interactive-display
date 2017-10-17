'use strict';

import five from 'johnny-five';
import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const board = new five.Board();
const app = express();
const server = http.Server(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});

const io = new SocketIO(server);

app.use(express['static'](__dirname + '/../public'));
app.use(express['static'](__dirname + '/../dist/public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', { title: 'Hey' })
});

board.on('ready', () => {
    io.on('connection', (socket) => {
        const proximity = new five.Proximity({
            controller: 'SRF05',
            pin: 7
        });

        const proximity2 = new five.Proximity({
            controller: 'SRF05',
            pin: 8
        });

        const proximity3 = new five.Proximity({
            controller: 'SRF05',
            pin: 4
        });

        proximity.on('data', (e) => {
            socket.emit('ping1', { cm: e.cm });
            console.log('FIRST ---->' + e.cm);
        });

        proximity2.on('data', (e) => {
            socket.emit('ping2', { cm: e.cm });
            console.log('SECOND ---->' + e.cm);
        });

        proximity3.on('data', (e) => {
            socket.emit('ping3', { cm: e.cm });
            console.log('THIRD ---->' + e.cm);
        });

        proximity.on('change', () => {
            console.log("The obstruction has moved.");
        });
    });
});
