const gameName = "crazyballs";

const gameInstructions = "Move your mouse around to collect the green balls while avoiding the red balls. You have 30 seconds to collect as many green balls as possible.";

let greenBalls = [];
let redBalls = [];
let score = 0;
let timeLeft = 30;

function setup() {
  const canvas = createCanvas(600, 600).parent("p5canvas");
  canvas.mouseMoved(movePlayer);
  
  spawnBalls();
  
  setInterval(countDown, 1000);
}

function draw() {
  background(220);
  
  moveBalls();
  
  displayBalls(greenBalls, color(50, 200, 50));
  displayBalls(redBalls, color(200, 50, 50));
  
  displayScore();
  displayTimer();
  
  checkCollisions();
}

function movePlayer() {
  player.x = mouseX;
  player.y = mouseY;
}

function spawnBalls() {
  for (let i = 0; i < 20; i++) {
    greenBalls.push(createRandomBall(20, color(50, 200, 50)));
  }
  
  for (let i = 0; i < 5; i++) {
    redBalls.push(createRandomBall(30, color(200, 50, 50)));
  }
}

function createRandomBall(size, color) {
  return {
    x: random(size, width-size),
    y: random(size, height-size),
    size: size,
    color: color
  }
}

function displayBalls(ballArray, color) {
  fill(color);
  noStroke();
  ballArray.forEach(ball => {
    ellipse(ball.x, ball.y, ball.size);
  });
}

function moveBalls() {
  greenBalls.forEach(ball => {
    ball.x += random(-3, 3);
    ball.y += random(-3, 3);
    ball.x = constrain(ball.x, ball.size/2, width-ball.size/2);
    ball.y = constrain(ball.y, ball.size/2, height-ball.size/2);
  });
  
  redBalls.forEach(ball => {
    ball.x += random(-5, 5);
    ball.y += random(-5, 5);
    ball.x = constrain(ball.x, ball.size/2, width-ball.size/2);
    ball.y = constrain(ball.y, ball.size/2, height-ball.size/2);
  });
}

function checkCollisions() {
  greenBalls.forEach(ball => {
    const d = dist(ball.x, ball.y, player.x, player.y);
    if (d < ball.size/2 + 10) {
      greenBalls = greenBalls.filter(b => b !== ball);
      score++;
    }
  });
  
  redBalls.forEach(ball => {
    const d = dist(ball.x, ball.y, player.x, player.y);
    if (d < ball.size/2 + 10) {
      redBalls = redBalls.filter(b => b !== ball);
      score--;
    }
  });
}

function displayScore() {
  textAlign(LEFT, TOP);
  textSize(32);
  fill(0);
  text(`Score: ${score}`, 10, 10);
}

function displayTimer() {
  textAlign(RIGHT, TOP);
  textSize(32);
  fill(0);
  text(`Time Left: ${timeLeft}`, width-10, 10);
}

function countDown() {
  timeLeft--;
  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  alert(`Game over! Score: ${score}`);
  greenBalls = [];
  redBalls = [];
  score = 0;
  timeLeft = 30;
  spawnBalls();
}