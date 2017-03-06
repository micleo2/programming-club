var socket = io();
var width = document.body.clientWidth * .95;
var height = document.body.clientHeight * .95;
var player = new Player(12, 12, null);
var keys = [];
var playerColor = getRandomColor();
var players = [];

function Player(x, y, id){
  this.x = x;
  this.y = y;
  this.radius = 6;
  this.id = id;

  this.r = Math.floor(Math.random() * 255);
  this.g = Math.floor(Math.random() * 255);
  this.b = Math.floor(Math.random() * 255);

  this.draw = function(){
    fill(this.r, this.g, this.b);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  };
}

function drawRemotePlayer(p){
  fill(p.r, p.g, p.b);
  ellipse(p.x, p.y, 12, 12);
}

function drawOtherPlayers(){
  for (var i = 0; i < players.length; i++){
    drawRemotePlayer(players[i]);
  }
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) * min;
}

function getRandomColor(){
  return color(getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255));
}

function handleInput(){
  var speed = 3;
  if (keys[87]){
    player.y -= speed;
  }
  if (keys[65]){
    player.x -= speed;
  }
  if (keys[83]){
    player.y += speed;
  }
  if (keys[68]){
    player.x += speed;
  }
  //left and right bounds
  if (player.x < -player.radius){
    player.x = width + player.radius;
  }else if (player.y > width + player.radius){
    player.x = -player.radius;
  }
  //up and down bounds
  if (player.y < -player.radius){
    player.y = height + player.radius;
  }else if (player.y > height + player.radius){
    player.y = -player.radius;
  }
}

void keyPressed(){
  keys[keyCode] = true;
}

void keyReleased(){
  keys[keyCode] = false;
}

void setup(){
  size(width, height);
  socket.emit("newPlayer", player);
}

void draw(){
  background(255);
  handleInput();
  player.draw();
  drawOtherPlayers();
  socket.emit("playerUpdate", player);
}

function findById(id){
  for (var i = 0; i < players.length; i++){
    if (players[i].id === id){
      return i;
    }
  }
  return -1;
}

socket.on("playerJoined", function(remotePlayer){
  players.push(remotePlayer);
});

socket.on("playerUpdate", function(remotePlayer){
  var updatedIndex = findById(remotePlayer.id);
  updatedIndex = updatedIndex == -1 ? players.length : updatedIndex;
  players[updatedIndex] = remotePlayer;
});

socket.on("playerLeft", function(id){
  var leftIndex = findById(id);
  players.splice(leftIndex, 1);
});
