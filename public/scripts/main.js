var socket = io();
var width = document.body.clientWidth * .95;
var height = document.body.clientHeight * .95;
var player = createPlayer();
var keys = [];
var playerColor = getRandomColor();
var players = [];

function HUDDisplay(){
  var b = player.boost;
  var maxB = 300;
  var perc = b / maxB;
  fill(0, 0, 0);
  rectMode(CENTER);
  rect(width/2, 1, width*perc, 20);
}

function Player(x, y, id){
  this.x = x;
  this.y = y;
  this.radius = 6;
  this.id = id;
  this.boost = 300;
  this.score = 0;
  this.isIt = false;

  this.r = Math.floor(Math.random() * 255);
  this.g = Math.floor(Math.random() * 255);
  this.b = Math.floor(Math.random() * 255);

  this.draw = function(){
    textSize(7);
    if (this.isIt){
      fill(255, 0, 0);
      text("I'M IT", this.x-7, this.y+this.radius*2.5);
      this.score += 0.05;
    }else{
      fill(this.r, this.g, this.b);
    }
    text(Math.floor(this.score), this.x-3, this.y-this.radius*1.5);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  };
}

function drawRemotePlayer(p){
  p.draw();
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
  var speed = 2;
  if (keys[66] && player.boost > 0){
    player.boost--;
    speed = 6;
  }

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
  }else if (player.x > width + player.radius){
    player.x = -player.radius;
  }
  //up and down bounds
  if (player.y < -player.radius){
    player.y = height + player.radius;
  }else if (player.y > height + player.radius){
    player.y = -player.radius;
  }
}

function intersects(that){
  dx = player.x - that.x;
  dy = player.y - that.y;
  dr = player.radius + that.radius;
  return (dx * dx + dy * dy < dr * dr);
}

function handleCollisions() {
  for (var i = 0; i < players.length; i++) {
    var cur = players[i];
    if (intersects(cur) && cur.isIt){
      socket.emit("touchedIt", cur);
    }
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
  if (!player.isIt){
    handleCollisions();
  }
  HUDDisplay();
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
  remotePlayer.draw = player.draw;
});

socket.on("playerUpdate", function(remotePlayer){
  remotePlayer.draw = player.draw;
  var updatedIndex = findById(remotePlayer.id);
  updatedIndex = updatedIndex == -1 ? players.length : updatedIndex;
  players[updatedIndex] = remotePlayer;
});

socket.on("playerLeft", function(id){
  var leftIndex = findById(id);
  players.splice(leftIndex, 1);
});

socket.on("urIt", function(){
  player.isIt = true;
  console.log("IM IT");
})

socket.on("relocate", function() {
  player.x = 60 + Math.random()*(width - 60);
  player.y = 60 + Math.random()*(height - 60);
  player.isIt = false;
});

socket.on("newGame", function(won) {
  player = createPlayer();
  if (won){
    alert("Congrats, you won! New game has already started..");
  }else{
    alert("Sorry, you lost. New game has already started..");
  }
});

function createPlayer(){
  var nx = 60 + Math.random()*(width - 60);
  var ny = 60 + Math.random()*(height - 60);
  var p = new Player(nx, ny, null);
  p.isIt = false;
  return p;
}
