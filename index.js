var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require('path');
var socketPool = {};
var it = null;

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
  });
  socket.on("disconnect", function(){
    delete socketPool[socket.id];
    if (it.id == socket.id){
      it = pickRandomProperty(socketPool);
      if (it != null){
        it.emit("urIt");
      }
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

function pickRandomProperty(obj) {
    var result = null;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = obj[prop];
    return result;
}
http.listen(3000, function(){
  console.log("Started on port *3000");
});
