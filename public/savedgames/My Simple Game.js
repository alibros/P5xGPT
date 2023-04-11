const gameName = "My Simple Game";
const gameInstructions = "Click the mouse anywhere on the canvas to start the game. The goal is to move the circle to the other side of the canvas without touching any rectangles. Use the arrow keys to move the circle. Good luck!";

let circleX, circleY;
let circleSpeed = 5;
let rectWidth = 50;
let rectHeight = 150;
let rectGap = 300;
let rectX;
let rectYTop, rectYBottom;
let gameStarted = false;
let gameCompleted = false;

function setup() {
  createCanvas(600, 600).parent('p5canvas');
  rectX = width / 2 - rectWidth / 2;
  rectYTop = height / 3 - rectHeight / 2;
  rectYBottom = (2 * height) / 3 - rectHeight / 2;
  circleX = width / 2;
  circleY = height / 2;
}

function draw() {
  background(220);

  if (!gameStarted) {
    textSize(24);
    textAlign(CENTER);
    fill(0);
    text(gameInstructions, width / 2, height / 2);
    return;
  }

  updateCircle();
  drawCircle();

  fill(0, 255, 0);
  rect(rectX, rectYTop, rectWidth, rectHeight);
  rect(rectX, rectYBottom, rectWidth, rectHeight);

  if (checkCollision()) {
    gameCompleted = false;
    setup();
  } else {
    if (circleX > width - 50) {
      gameCompleted = true;
      setup();
    }
  }

  textSize(24);
  textAlign(CENTER);
  fill(0);
  text(gameName, width / 2, 50);

  if (gameCompleted) {
    textSize(48);
    fill(255, 0, 0);
    text("YOU WIN!", width / 2, height / 2);
  }
}

function updateCircle() {
  if (keyIsDown(LEFT_ARROW)) {
    circleX -= circleSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    circleX += circleSpeed;
  }
  if (keyIsDown(UP_ARROW)) {
    circleY -= circleSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    circleY += circleSpeed;
  }
  circleX = constrain(circleX, 0, width);
  circleY = constrain(circleY, 0, height);
}

function drawCircle() {
  fill(255, 0, 0);
  ellipse(circleX, circleY, 50, 50);
}

function checkCollision() {
  if (
    circleX + 25 > rectX &&
    circleX - 25 < rectX + rectWidth &&
    circleY - 25 < rectYTop + rectHeight &&
    circleY + 25 > rectYTop
  ) {
    return true;
  }
  if (
    circleX + 25 > rectX &&
    circleX - 25 < rectX + rectWidth &&
    circleY - 25 < rectYBottom + rectHeight &&
    circleY + 25 > rectYBottom
  ) {
    return true;
  }
  return false;
}

function mouseClicked() {
  if (!gameStarted) {
    gameStarted = true;
  }
}