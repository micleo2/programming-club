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
  this.id = id;

  this.draw = function(){
    fill(0);
    ellipse(this.x, this.y, 12, 12);
  };
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
}

void keyPressed(){
  keys[keyCode] = true;
}

void keyReleased(){
  keys[keyCode] = false;
}

void setup(){
  size(width, height);
}

void draw(){
  background(255);
  handleInput();
  player.draw();
  socket.emit("playerUpdate", player);
}
