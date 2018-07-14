/* global rough */

var rootElement = document.getElementById("root");
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var canvas = document.createElement("canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var ctx = canvas.getContext("2d");
var rc = rough.canvas(canvas);
rootElement.appendChild(canvas);

var PLAYER_START_X = 20;
var PLAYER_START_Y = 20;
var PLAYER_WIDTH = 10;
var PLAYER_HEIGHT = 40;
var PLAYER_TERMINAL_SPEED = 25;
var PLAYER_MAX_SPEED = 7;
var PLAYER_ACCELERATION = 1;
var PLAYER_DEACCELERATION = 2;
var PLAYER_UPWARD_GRAVITY = 3;
var PLAYER_DOWNWARD_GRAVITY = 10;
var MAX_DOUBLE_JUMP = 1;
var PLAYER_JUMP_IMPACT = 25;

var player = {
  x: PLAYER_START_X,
  y: PLAYER_START_Y,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  falling: true,
  movingLeft: false,
  movingRight: false,
  doubleJump: MAX_DOUBLE_JUMP,
  speedX: 0,
  speedY: 0
};
var ground = [];

function init() {
  initGround();
}

function initGround() {
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

  ground.push({
    x: 500,
    y: CANVAS_HEIGHT - 310,
    width: 20,
    height: 20,
    color: "lightblue"
  });

  ground.push({
    x: 550,
    y: CANVAS_HEIGHT - 310,
    width: 20,
    height: 20,
    color: "lightblue"
  });

  ground.push({
    x: 600,
    y: CANVAS_HEIGHT - 310,
    width: 20,
    height: 20,
    color: "lightblue"
  });

  ground.push({
    x: 650,
    y: CANVAS_HEIGHT - 360,
    width: 20,
    height: 20,
    color: "lightblue"
  });

  ground.push({
    x: 700,
    y: CANVAS_HEIGHT - 360,
    width: 20,
    height: 20,
    color: "lightblue"
  });

  ground.push({
    x: 750,
    y: CANVAS_HEIGHT - 360,
    width: 20,
    height: 20,
    color: "lightblue"
  });

  ground.push({
    x: 600,
    y: CANVAS_HEIGHT - 510,
    width: 100,
    height: 10,
    color: "orange"
  });

  ground.push({
    x: 0,
    y: 0,
    width: CANVAS_WIDTH,
    height: 10,
    color: "green"
  });

  ground.push({
    x: 0,
    y: CANVAS_HEIGHT - 10,
    width: CANVAS_WIDTH,
    height: 10,
    color: "green"
  });
}

function render(prevPlayer, player, t) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  rc.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, {
    fill: "lightgray",
    flllWeight: 1,
    roughness: 0,
    hachureAngle: 60,
    hachureGap: 10,
    strokeWidth: 0.25
  });
  renderPlayer(prevPlayer, player, t);
  renderGround();
}

function renderPlayer(prevPlayer, player, t) {
  var x = prevPlayer ? prevPlayer.x + (player.x - prevPlayer.x) * t : player.x;
  var y = prevPlayer ? prevPlayer.y + (player.y - prevPlayer.y) * t : player.y;
  rc.rectangle(x, y, player.width, player.height, {
    fill: "red",
    roughness: 0
  });
  // ctx.fillStyle = "red";
  // ctx.fillRect(x, y, player.width, player.height);
}

function renderGround() {
  for (var i = 0; i < ground.length; ++i) {
    rc.rectangle(ground[i].x, ground[i].y, ground[i].width, ground[i].height, {
      fill: ground[i].color,
      roughness: 0
    });
    // ctx.fillStyle = ground[i].color;
    // ctx.fillRect(ground[i].x, ground[i].y, ground[i].width, ground[i].height);
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
      fixPlayerCollisonY();
      if (player.speedY > 0) {
        player.falling = false;
        player.doubleJump = MAX_DOUBLE_JUMP;
      }
      player.speedY = 0;
    }
  }

  if (player.movingLeft) {
    player.speedX -= PLAYER_ACCELERATION;
    if (player.speedX < -PLAYER_MAX_SPEED) {
      player.speedX = -PLAYER_MAX_SPEED;
    }
  } else {
    if (player.speedX < 0) {
      player.speedX += PLAYER_DEACCELERATION;
      if (player.speedX > 0) {
        player.speedX = 0;
      }
    }
  }

  if (player.movingRight) {
    player.speedX += PLAYER_ACCELERATION;
    if (player.speedX > PLAYER_MAX_SPEED) {
      player.speedX = PLAYER_MAX_SPEED;
    }
  } else {
    if (player.speedX > 0) {
      player.speedX -= PLAYER_DEACCELERATION;
      if (player.speedX < 0) {
        player.speedX = 0;
      }
    }
  }

  player.x += player.speedX;
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > CANVAS_WIDTH) {
    player.x = CANVAS_WIDTH - player.width;
  }
  checkFalling();

  fixPlayerCollisonX();
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

function fixPlayerCollisonY() {
  while (collidesWithGround(player)) {
    player.y += -getNumberSign(player.speedY);
  }
}

function fixPlayerCollisonX() {
  while (collidesWithGround(player)) {
    player.x += player.movingLeft ? 1 : -1;
  }
}

function getNumberSign(speed) {
  if (speed > 0) {
    return 1;
  } else if (speed < 0) {
    return -1;
  } else {
    return 0;
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
    player.speedY = -PLAYER_JUMP_IMPACT;
    player.falling = true;
  } else if (player.doubleJump > 0) {
    player.speedY = -PLAYER_JUMP_IMPACT;
    player.doubleJump -= 1;
  }
}

var blockJump = false;
document.body.addEventListener("keydown", function(e) {
  if (!blockJump && (e.key === "ArrowUp" || e.key === " ")) {
    playerJump();
    blockJump = true;
  } else if (e.key === "ArrowLeft") {
    player.movingLeft = true;
  } else if (e.key === "ArrowRight") {
    player.movingRight = true;
  }
});

document.body.addEventListener("keyup", function(e) {
  if (e.key === "ArrowUp" || e.key === " ") {
    blockJump = false;
  } else if (e.key === "ArrowLeft") {
    player.movingLeft = false;
  } else if (e.key === "ArrowRight") {
    player.movingRight = false;
  }
});

init();
render(null, player);
var lastUpdate = Date.now();
var TIME_PER_UPDATE = 50;
var prevPlayer = null;
setInterval(function() {
  var now = Date.now();
  if (now - lastUpdate > TIME_PER_UPDATE) {
    prevPlayer = Object.assign({}, player);
    update();
    lastUpdate = now;
  }
  render(prevPlayer, player, (now - lastUpdate) / TIME_PER_UPDATE);
}, 0);
