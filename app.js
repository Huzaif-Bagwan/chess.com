const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');

//making middleware to route requests
const app = express();

//creating server and socket.io instance
const server = http.createServer(app);
const io = socket(server);


//initialization of chess game from Chess.js
//This will be used to manage the chess game state
const chess = new Chess();
let players = {};
let currentPlayer = 'W';


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Chess Game' });
})

io.on("connection", function (uniqueSocket) {
    console.log("A user Connected");
})

server.listen(3000, function () {
    console.log('Server is running on port 3000');

});