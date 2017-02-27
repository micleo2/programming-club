var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function(socket){
  socket.on("playerUpdate", function(x, y){
    socket.broadcast.emit("drawRemotePlayer", x, y);
  });
});

http.listen(3000, function(){
  console.log("Started on port *3000");
});
