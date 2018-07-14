var rootElement = document.getElementById("root");
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
rootElement.appendChild(canvas);

var PLAYER_START_X = 10;
var PLAYER_START_Y = 10;
var PLAYER_WIDTH = 10;
var PLAYER_HEIGHT = 40;
var PLAYER_TERMINAL_SPEED = 15;
var PLAYER_SPEED = 5;
var PLAYER_UPWARD_GRAVITY = 2;
var PLAYER_DOWNWARD_GRAVITY = 6;

var player = {
  x: PLAYER_START_X,
  y: PLAYER_START_Y,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  falling: true,
  movingLeft: false,
  movingRight: false,
  speedY: 0
};
var ground = [];

function init() {
  initGround();
}

function initGround() {
  ground.push({
    x: 0,
    y: CANVAS_HEIGHT - 10,
    width: CANVAS_WIDTH,
    height: 10,
    color: "green"
  });

  ground.push({
    x: 200,
    y: CANVAS_HEIGHT - 85,
    width: 200,
    height: 10,
    color: "orange"
  });

  ground.push({
    x: 50,
    y: CANVAS_HEIGHT - 160,
    width: 100,
    height: 10,
    color: "orange"
  });

  ground.push({
    x: 200,
    y: CANVAS_HEIGHT - 235,
    width: 150,
    height: 10,
    color: "orange"
  });

  ground.push({
    x: 350,
    y: CANVAS_HEIGHT - 310,
    width: 100,
    height: 10,
    color: "orange"
  });
}

function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  renderPlayer();
  renderGround();
}

function renderPlayer() {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function renderGround() {
  for (var i = 0; i < ground.length; ++i) {
    ctx.fillStyle = ground[i].color;
    ctx.fillRect(ground[i].x, ground[i].y, ground[i].width, ground[i].height);
  }
}

function update() {
  updatePlayer();
}

function updatePlayer() {
  if (player.falling) {
    if (player.speedY < PLAYER_TERMINAL_SPEED) {
      if (player.speedY < 0) {
        player.speedY += PLAYER_UPWARD_GRAVITY;
      } else {
        player.speedY += PLAYER_DOWNWARD_GRAVITY;
      }
    }
    player.y += player.speedY;
    if (collidesWithGround(player)) {
      player.falling = false;
      player.speedY = 0;
      while (collidesWithGround(player)) {
        player.y -= 1;
      }
    }
  }

  if (player.movingLeft) {
    player.x -= PLAYER_SPEED;
    if (player.x < 0) {
      player.x = 0;
    }
    checkFalling();
  }

  if (player.movingRight) {
    player.x += PLAYER_SPEED;
    if (player.x + player.width > CANVAS_WIDTH) {
      player.x = CANVAS_WIDTH - player.width;
    }
    checkFalling();
  }
}

function checkFalling() {
  var playerFallTestRect = {
    x: player.x,
    y: player.y + 10,
    width: player.width,
    height: player.height
  };
  if (!collidesWithGround(playerFallTestRect)) {
    player.falling = true;
  }
}

function collidesWithGround(rect) {
  for (var i = 0; i < ground.length; ++i) {
    if (collidesWithRect(rect, ground[i])) {
      return true;
    }
  }
  return false;
}

function collidesWithRect(rect1, rect2) {
  var A = rect1.x;
  var B = rect1.y;
  var C = rect1.x + rect1.width;
  var D = rect1.y + rect1.height;

  var E = rect2.x;
  var F = rect2.y;
  var G = rect2.x + rect2.width;
  var H = rect2.y + rect2.height;

  return !(C < E || D < F || A > G || B > H);
}

function playerJump() {
  if (!player.falling) {
    player.speedY = -20;
    player.falling = true;
  }
}

document.body.addEventListener("keydown", function(e) {
  if (e.key === "ArrowUp") {
    playerJump();
  } else if (e.key === "ArrowLeft") {
    player.movingLeft = true;
  } else if (e.key === "ArrowRight") {
    player.movingRight = true;
  }
});

document.body.addEventListener("keyup", function(e) {
  if (e.key === "ArrowLeft") {
    player.movingLeft = false;
  } else if (e.key === "ArrowRight") {
    player.movingRight = false;
  }
});

init();
render();
setInterval(function() {
  update();
  render();
}, 50);
