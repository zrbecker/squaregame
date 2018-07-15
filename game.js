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
var PLAYER_START_Y = 500;
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

var BULLET_WIDTH = 15;
var BULLET_HEIGHT = 5;
var BULLET_SPEED = 20;
var BULLET_COOLDOWN = 500;

var COIN_WIDTH = 5;
var COIN_HEIGHT = 10;
var COIN_SPAWN_RATE = 2000;
var MAX_COINS = 2;

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
  speedY: 0,
  direction: "Right"
};
var ground = [];
var bullets = [];
var coins = [];
var enemies = [];
var coinsCollected = 0;
var playerDontInterpolate = false;

function init() {
  initGround();
  initCoins();
  initEnemies();
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

function initCoins() {
  coins.push({
    x: 60,
    y: CANVAS_HEIGHT - 175,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    color: "yellow"
  });

  coins.push({
    x: 300,
    y: CANVAS_HEIGHT - 250,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    color: "yellow"
  });

  coins.push({
    x: 435,
    y: CANVAS_HEIGHT - 325,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    color: "yellow"
  });

  coins.push({
    x: 607,
    y: CANVAS_HEIGHT - 325,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    color: "yellow"
  });

  coins.push({
    x: 757,
    y: CANVAS_HEIGHT - 375,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    color: "yellow"
  });

  coins.push({
    x: 610,
    y: CANVAS_HEIGHT - 525,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    color: "yellow"
  });

  coins.push({
    x: 630,
    y: CANVAS_HEIGHT - 525,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    color: "yellow"
  });

  coins.push({
    x: 650,
    y: CANVAS_HEIGHT - 525,
    width: COIN_WIDTH,
    height: COIN_HEIGHT,
    color: "yellow"
  });
}

function updateEnemy(index) {
  var now = Date.now();
  if (collidesWithBullets(enemies[index])) {
    enemies[index].active = false;
    enemies[index].deathTime = now;
  }
  if (!enemies[index].active && now - enemies[index].deathTime > 10000) {
    enemies[index].active = true;
  }
}

function initEnemies() {
  enemies.push({
    x: 125,
    y: CANVAS_HEIGHT - 191,
    width: 10,
    height: 30,
    color: "blue",
    update: updateEnemy,
    active: true
  });

  enemies.push({
    x: 325,
    y: CANVAS_HEIGHT - 266,
    width: 10,
    height: 30,
    color: "blue",
    update: updateEnemy,
    active: true
  });

  enemies.push({
    x: 555,
    y: CANVAS_HEIGHT - 341,
    width: 10,
    height: 30,
    color: "blue",
    update: updateEnemy,
    active: true
  });

  enemies.push({
    x: 705,
    y: CANVAS_HEIGHT - 391,
    width: 10,
    height: 30,
    color: "blue",
    update: updateEnemy,
    active: true
  });
}

function render(prevPlayer, prevBullets, player, t) {
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
  renderBullets(prevBullets, bullets, t);
  renderCoins();
  renderEnemies();
  renderUI();
}

function renderPlayer(prevPlayer, player, t) {
  var x = prevPlayer ? prevPlayer.x + (player.x - prevPlayer.x) * t : player.x;
  var y = prevPlayer ? prevPlayer.y + (player.y - prevPlayer.y) * t : player.y;
  rc.rectangle(x, y, player.width, player.height, {
    fill: "red",
    roughness: 0
  });
}

function renderRectangles(prevRects, rects, t, defaultColor, defaultOutline) {
  if (!defaultColor) {
    defaultColor = "black";
  }
  if (!defaultOutline) {
    defaultOutline = "black";
  }
  for (var i = 0; i < rects.length; ++i) {
    // var prevRect = prevRects ? prevRects[rects[i].id] : null;
    var rect = rects[i];
    var x = rect.x;
    var y = rect.y;
    // var x = prevRect ? prevRect.x + (rect.x - prevRect.x) * t : rect.x;
    // var y = prevRect ? prevRect.y + (rect.y - prevRect.y) * t : rect.y;
    rc.rectangle(x, y, rects[i].width, rects[i].height, {
      fill: rects[i].color || defaultColor,
      stroke: rects[i].outline || defaultOutline,
      roughness: 0
    });
  }
}

function renderGround() {
  renderRectangles(null, ground);
}

function renderBullets(prevBullets, bullets, t) {
  renderRectangles(prevBullets, bullets, t);
}

function renderEnemies() {
  var activeEnemies = [];
  for (var i = 0; i < enemies.length; ++i) {
    if (enemies[i].active) {
      activeEnemies.push(enemies[i]);
    }
  }
  renderRectangles(null, activeEnemies);
}

function renderCoins() {
  var activeCoins = [];
  for (var i = 0; i < coins.length; ++i) {
    if (coins[i].active) {
      activeCoins.push(coins[i]);
    }
  }
  renderRectangles(null, activeCoins);
}

function renderUI() {
  ctx.font = "24px monospace";
  ctx.fillStyle = "black";
  ctx.fillText("Coins: " + coinsCollected, 10, 40);

  ctx.font = "16px monospace";
  ctx.fillStyle = "black";
  ctx.fillText("Controls:", 10, 80);
  ctx.fillText("- Arrows for movement and jumping.", 10, 100);
  ctx.fillText('- "Z" to shoot.', 10, 120);
}

function update() {
  updatePlayer();
  updateBullets();
  updateEnemies();
  updateCoins();
}

function getInactiveCoin() {
  var randomIndex = Math.floor(Math.random() * coins.length);
  if (!coins[randomIndex].active) {
    return coins[randomIndex];
  }
}

var lastCoinSpawnOrCollected = Date.now();
var activeCoins = 0;
function updateCoins() {
  var now = Date.now();
  if (
    now - lastCoinSpawnOrCollected > COIN_SPAWN_RATE &&
    activeCoins < MAX_COINS
  ) {
    lastCoinSpawnOrCollected = now;
    var inactiveCoin = getInactiveCoin();
    if (inactiveCoin) {
      inactiveCoin.active = true;
      activeCoins += 1;
    }
  }

  for (var i = 0; i < coins.length; ++i) {
    var coin = coins[i];
    if (collidesWithRect(player, coin) && coin.active) {
      lastCoinSpawnOrCollected = now;
      coin.active = false;
      activeCoins -= 1;
      coinsCollected += 1;
    }
  }
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
    player.direction = "Left";
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
    player.direction = "Right";
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

  if (collidesWithEnemies(player)) {
    player.x = PLAYER_START_X;
    player.y = PLAYER_START_Y;
    player.speedX = 0;
    player.speedY = 0;
    playerDontInterpolate = true;
  }
}

function updateBullets() {
  for (var i = 0; i < bullets.length; ++i) {
    bullets[i].x += bullets[i].speedX;
    if (collidesWithGround(bullets[i])) {
      bullets[i].deleted = true;
    } else if (bullets[i].x < -BULLET_WIDTH || bullets[i].x > CANVAS_WIDTH) {
      bullets[i].deleted = true;
    }
  }
  var bulletsCopy = [];
  for (var j = 0; j < bullets.length; ++j) {
    if (!bullets[j].deleted) {
      bulletsCopy.push(bullets[j]);
    }
  }
  bullets = bulletsCopy;
}

function updateEnemies() {
  for (var i = 0; i < enemies.length; ++i) {
    enemies[i].update(i);
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

function collidesWithRects(rect, rects) {
  for (var i = 0; i < rects.length; ++i) {
    if (collidesWithRect(rect, rects[i])) {
      return true;
    }
  }
  return false;
}

function collidesWithBullets(rect) {
  return collidesWithRects(rect, bullets);
}

function collidesWithGround(rect) {
  return collidesWithRects(rect, ground);
}

function collidesWithEnemies(rect) {
  var activeEnemies = [];
  for (var i = 0; i < enemies.length; ++i) {
    if (enemies[i].active) {
      activeEnemies.push(enemies[i]);
    }
  }
  return collidesWithRects(rect, activeEnemies);
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
var blockShoot = false;
var nextBulletId = 0;
var lastShot = Date.now();
document.body.addEventListener("keydown", function(e) {
  if (!blockJump && (e.key === "ArrowUp" || e.key === " ")) {
    playerJump();
    blockJump = true;
  } else if (e.key === "ArrowLeft") {
    player.movingLeft = true;
  } else if (e.key === "ArrowRight") {
    player.movingRight = true;
  } else if (e.key === "z") {
    var now = Date.now();
    if (!blockShoot && now - lastShot >= BULLET_COOLDOWN) {
      blockShoot = true;
      lastShot = now;
      if (player.direction === "Right") {
        bullets.push({
          id: nextBulletId++,
          x: player.x + PLAYER_WIDTH * 2,
          y: player.y + PLAYER_HEIGHT * 0.5,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          speedX: BULLET_SPEED
        });
      } else {
        bullets.push({
          x: player.x - PLAYER_WIDTH - BULLET_WIDTH,
          y: player.y + PLAYER_HEIGHT * 0.5,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          speedX: -BULLET_SPEED
        });
      }
    }
  } else if (e.key === "d") {
    console.log(coins); // eslint-disable-line no-console
    console.log("active coins: " + activeCoins); // eslint-disable-line no-console
    console.log(player); // eslint-disable-line no-console
    console.log(bullets); // eslint-disable-line no-console
    console.log("collected coins: " + coinsCollected); // eslint-disable-line no-console
  }
});

document.body.addEventListener("keyup", function(e) {
  if (e.key === "ArrowUp" || e.key === " ") {
    blockJump = false;
  } else if (e.key === "ArrowLeft") {
    player.movingLeft = false;
  } else if (e.key === "ArrowRight") {
    player.movingRight = false;
  } else if (e.key === "z") {
    blockShoot = false;
  }
});

function getPrevBullets() {
  var prevBullets = {};
  for (var i = 0; i < bullets.length; ++i) {
    prevBullets[bullets[i].id] = bullets[i];
  }
  return prevBullets;
}

init();
render(null, null, player);
var lastUpdate = Date.now();
var TIME_PER_UPDATE = 50;
var prevPlayer = null;
var prevBullets = null;
setInterval(function() {
  var now = Date.now();
  if (now - lastUpdate > TIME_PER_UPDATE) {
    prevPlayer = Object.assign({}, player);
    prevBullets = getPrevBullets();
    update();
    if (playerDontInterpolate) {
      prevPlayer = null;
      playerDontInterpolate = false;
    }
    lastUpdate = now;
  }
  render(prevPlayer, prevBullets, player, (now - lastUpdate) / TIME_PER_UPDATE);
}, 0);
