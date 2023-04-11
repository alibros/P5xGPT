const gameName = 'trippyart'; 

const gameInstructions = 'Just sit back, relax, and enjoy the trippy animation.';

function setup() {
  createCanvas(600, 600).parent('p5canvas');
  background(0);
  noStroke();
}

function draw() {
  // create a colorful gradient
  for (let i = 0; i < height; i++) {
    let c = color(i / height * 255, 255, 255);
    stroke(c);
    line(0, i, width, i);
  }

  // draw shifting circles
  fill(255, 0, 0, 50);
  ellipse(mouseX, mouseY, 100, 100);
  fill(0, 255, 0, 50);
  ellipse(width - mouseX, mouseY, 100, 100);
  fill(0, 0, 255, 50);
  ellipse(width - mouseX, height - mouseY, 100, 100);
  fill(255, 255, 0, 50);
  ellipse(mouseX, height - mouseY, 100, 100);

  // create color-rotating rectangle
  push();
  translate(width / 2, height / 2);
  rotate(frameCount / 50);
  fill(255);
  rect(0, 0, 200, 200);
  pop();
}