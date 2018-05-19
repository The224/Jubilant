'use strict';

const COOLDOWN = 30;
const GAME_LENGHT = 180;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const loremIpsum = require('lorem-ipsum');

let users = [
    { username: 'Doggo 🐶', free: true, progress: 0, position: 0 },
    { username: 'Mimi 🐭', free: true, progress: 0, position: 0 },
    { username: 'Tyro 🦖', free: true, progress: 0, position: 0 },
    { username: 'Bloup 🐠', free: true, progress: 0, position: 0 },
    { username: 'Ham-burger 🐹', free: true, progress: 0, position: 0 },
    { username: 'Boing 🐰', free: true, progress: 0, position: 0 },
    { username: 'Le Jubilant 🐴', free: true, progress: 0, position: 0 },
    { username: 'Lulu 🦄', free: true, progress: 0, position: 0 },
    { username: 'Komodo 🐲', free: true, progress: 0, position: 0 },
    { username: 'Froggy 🐸', free: true, progress: 0, position: 0 },
    { username: 'Rocco 🐷', free: true, progress: 0, position: 0 },
    { username: 'Happy 💩', free: true, progress: 0, position: 0 },
    { username: 'Presto 🐢', free: true, progress: 0, position: 0 },
    { username: 'Touch 🐙', free: true, progress: 0, position: 0 },
    { username: 'Neko 🐱', free: true, progress: 0, position: 0 },
    { username: 'Wally 🐳', free: true, progress: 0, position: 0 },
    { username: 'Batman 🦇', free: true, progress: 0, position: 0 },
    { username: 'Jiji 🐼', free: true, progress: 0, position: 0 }
];

let game_time = 0;
let is_game = 0;
let intervalId;
let game_text = loremIpsum({ count: 1, units: 'paragraphs', paragraphUpperBound: 4, format: 'plain', random: Math.random, suffix: 'EOL' });

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.get('/', (req, res) => {
    res.send('WebSocket Server!');
});

app.get('/free', (req, res) => {
    res.send(users);
    users = users.map(user => {
        user.free = true;
        return user;
    });
});

app.get('/user', (req, res) => {
    const user = users.find(user => user.free === true);
    if (user) {
        user.free = false;
        res.json({ data: user });
    } else {
        res.json({ error: 'no_more_user' });
    }
});

io.on('connection', (socket) => {

    console.log('user connected');

    socket.on('disconnect', (data) => {
        console.log(data);
    });

    // Chat Message
    socket.on('message', (data) => {
        io.emit('message', data);
    });

    // When user press key
    socket.on('progress', (data) => {
        console.log(data);

        const players = users.filter(user => {
            if (!user.free) {
                if (data.username === user.username) {
                    user.progress = data.progress;
                }
                return true;
            }
            return false;
        });
        io.emit('progress', players);
    });

    // When user logout
    socket.on('free', (data) => {
        const user = users.find(user => user.username === JSON.parse(data).username);
        user.free = true;
    });

    // Emit time of current game
    if (intervalId === undefined) {
        intervalId = setInterval(() => {
            if (game_time > 0) {
                game_time--;
            } else {
                if (is_game) {
                    game_time = GAME_LENGHT;
                    is_game = false;
                    resetProgress();
                    game_text = loremIpsum({ count: 1, units: 'paragraphs', paragraphUpperBound: 4, format: 'plain', random: Math.random, suffix: 'EOL' });
                } else {
                    game_time = COOLDOWN;
                    is_game = true;
                }
            }
            io.emit('time', { game_time: game_time, is_game: is_game, game_text: game_text });
        }, 1000);
    }

});


function resetProgress() {
    users.forEach(user => {
        user.progress = 0;
        user.position = 0;
    });
}


http.listen(4201, () => {
    console.log('Server started on port 4201');
});
