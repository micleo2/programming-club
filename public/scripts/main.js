var socket = io();
var width = document.body.clientWidth * .95;
var height = document.body.clientHeight * .95;
var xpos = 100;
var ypos = 100;
var keys = [];
var playerColor = getRandomColor();

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) * min;
}

function getRandomColor(){
  return color(getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255));
}

function handleInput(){
  var speed = 3;
  if (keys[87]){
    ypos -= speed;
  }
  if (keys[65]){
    xpos -= speed;
  }
  if (keys[83]){
    ypos += speed;
  }
  if (keys[68]){
    xpos += speed;
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
  // background(255);
  noStroke();
  fill(playerColor);
  ellipse(xpos, ypos, 12, 12);
  handleInput();
  socket.emit("playerUpdate", xpos, ypos);
}

socket.on("drawRemotePlayer", function(x, y){
  fill(255, 0, 0);
  ellipse(x, y, 13, 13);
});
