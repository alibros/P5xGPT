const gameName = "Worms";

let worms = [];
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(600, 600).parent("p5canvas");
  frameRate(10);
  for (let i = 0; i < 5; i++) {
    worms.push(new Worm());
  }
}

function draw() {
  if (!gameOver) {
    background(220);
    fill("#005000");
    textSize(20);
    text(`Score: ${score}`, 20, 30);
    for (let i = 0; i < worms.length; i++) {
      worms[i].show();
      worms[i].move();
      if (worms[i].offScreen()) {
        worms[i].reset();
        score -= 5;
      }
      if (worms[i].hit(mouseX, mouseY)) {
        worms[i].reset();
        score += 10;
      }
    }
  } else {
    fill("#FF0000");
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2);
    textAlign(LEFT);
  }
}

function mousePressed() {
  if (gameOver) {
    score = 0;
    gameOver = false;
    for (let i = 0; i < worms.length; i++) {
      worms[i].reset();
    }
  }
}

class Worm {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(20, 50);
    this.speedX = random(-5, 5);
    this.speedY = random(-5, 5);
  }

  show() {
    fill("#D3D3D3");
    stroke("#808080");
    strokeWeight(2);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  offScreen() {
    if (this.x < -this.diameter || this.x > width + this.diameter || this.y < -this.diameter || this.y > height + this.diameter) {
      return true;
    } else {
      return false;
    }
  }

  hit(x, y) {
    let distance = dist(x, y, this.x, this.y);
    if (distance < this.diameter / 2) {
      return true;
    } else {
      return false;
    }
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.speedX = random(-5, 5);
    this.speedY = random(-5, 5);
  }
}