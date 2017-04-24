var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require('path');
var socketPool = {};
var it = null; //the socket handle which is currently 'it'
var winningScore = 100;
var port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function(socket){
  socketPool[socket.id] = socket;
  socket.on("newPlayer", function(p){
    p.id = socket.id;
    socket.broadcast.emit("playerJoined", p);
  });
  socket.on("playerUpdate", function(p){
    p.id = socket.id;
    socket.broadcast.emit("playerUpdate", p);
    if (p.score >= winningScore){
      createNewGame(socket);
    }
  });
  socket.on("disconnect", function(){
    delete socketPool[socket.id];
    if (it.id == socket.id){
      chooseIt();
    }
    io.emit("playerLeft", socket.id);
  });
  socket.on("touchedIt", function(oldIt){
    socket.emit("urIt");
    socketPool[oldIt.id].emit("relocate");
  })
  if (it == null){
    socket.emit("urIt");
    it = socket;
  }
});

function chooseIt(){
  it = pickRandomProperty(socketPool);
  if (it != null){
    it.emit("urIt");
  }
}

//following source code taken from http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object/15106541
function pickRandomProperty(obj) {
    var result = null;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = obj[prop];
    return result;
}

function createNewGame(socketChamp){
  socketChamp.emit("newGame", true);
  socketChamp.broadcast.emit("newGame", false);
  chooseIt();
}

if (process.env.IP){
  http.listen(process.env.PORT || port, process.env.IP, function(){
    console.log('listening on *:' + (process.env.PORT || port));
  });
}else{
  http.listen(process.env.PORT || port, function(){
    console.log('listening on *:' + (process.env.PORT || port));
  });
}
