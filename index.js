var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function(socket){
  socket.on("newPlayer", function(p){
    p.id = socket.id;
    socket.broadcast.emit("playerJoined", p);
  });
  socket.on("playerUpdate", function(p){
    p.id = socket.id;
    socket.broadcast.emit("playerUpdate", p);
  });
});

http.listen(3000, function(){
  console.log("Started on port *3000");
});
