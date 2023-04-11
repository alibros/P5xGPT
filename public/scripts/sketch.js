const gameName = "blankcanvas";
const canvasWidth = 600;
const canvasHeight = 600;

let ballX;
let ballY;
let ballSize;
let squareSize = 100;
let squareX = canvasWidth - squareSize;
let squareY = 0;

function setup() {
  let cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.parent("p5canvas");

  ballX = width / 2;
  ballY = height / 2;
  ballSize = 50;
}

function draw() {
  background(128, 0, 0); // Change the background color to dark red
  fill(0, 0, 255);
  ellipse(ballX, ballY, ballSize, ballSize);

  // Replace gray square with green square
  fill(0, 255, 0);
  rect(squareX, squareY, squareSize, squareSize);

  // Check for collision between ball and square
  if (ballX + ballSize / 2 >= squareX && ballX - ballSize / 2 <= squareX + squareSize &&
      ballY + ballSize / 2 >= squareY && ballY - ballSize / 2 <= squareY + squareSize) {
    alert("You win!"); // Display message if ball touches square
    resetGame();
  }
  
  if (keyIsDown(RIGHT_ARROW)) {
    ballX += 5;
  }
  if (keyIsDown(LEFT_ARROW)) {
    ballX -= 5;
  }
  if (keyIsDown(UP_ARROW)) {
    ballY -= 5;
  }
  if (keyIsDown(DOWN_ARROW)) {
    ballY += 5;
  }
}

function resetGame() {
  ballX = width / 2;
  ballY = height / 2;
}

const gameInstructions = 'Use the arrow keys to move the blue ball on the dark red background. Try to touch the green square to win.';