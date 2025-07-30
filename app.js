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
let players = {}; // players object to store the connected players!
let currentPlayer = 'W'; // current player, 'W' for white, 'B' for black when userlogin it will bes set as white as we set currentPlayer to 'W'


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { title: 'Chess Game' });
})

//Socket.io connection handling when user cnnects the server it will log the messgae that user is connected
//uniqueSocket is the container for the user who is connect to the server!
//basically uniqueSocket means the user who is connected to the server!
io.on("connection", function (uniqueSocket) {
    console.log("A user Connected");


    /* when a user connect to the server, it will check which player is availabe 
    if no player is available then it will create a user as a whiteplayer!*/
    if (!players.white) {
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "w");
    }

    //if white player is already present then it will check for black player and create a user as black player 
    else if (!players.black) {
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "b");
    }

    //if bothe players are there in server it will make the 3rd user as a spectator!
    else {
        uniqueSocket.emit("spectatorRole");
    }

    //when a user disconnect like close the browser or refresh it will delete the user from the players object 
    //it will check if player is white or black with its uniqueSocket.id
    //and delete the player from the players object
    uniqueSocket.on("disconnect", function () {
        if (uniqueSocket.id == players.white) {
            delete players.white;
        }
        else if (uniqueSocket.id == players.black) {
            delete players.black;
        }
    });

});

server.listen(3000, function () {
    console.log('Server is running on port 3000');

});