let circleX = 300; // Initialize circle's x position
let circleY = 300; // Initialize circle's y position
let circleSize = 100; // Initialize circle's size

function setup() {
  createCanvas(600, 600).parent("p5canvas");
}

function draw() {
  background(0, 255, 0); // change background to green
  
  // Move the circle with arrow keys
  if (keyIsDown(LEFT_ARROW)) {
    circleX -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    circleX += 5;
  }
  if (keyIsDown(UP_ARROW)) {
    circleY -= 5;
  }
  if (keyIsDown(DOWN_ARROW)) {
    circleY += 5;
  }
  
  // Draw the blue circle at the new position
  fill(0,0,255);
  ellipse(circleX, circleY, circleSize, circleSize);
  
  // Create a red square
  fill(255,0,0);
  rect(400, 250, 100, 100); // Place the red square next to the circle
}