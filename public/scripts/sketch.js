let bird;
let pipes = [];
let score = 0;
let gameEnd = false;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('p5canvas');
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(0);
  
  // Loop through all pipes to display and check for collision
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].hits(bird)) {
      endGame();
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  bird.update();
  bird.show();
  
  // Add new pipe every 100 frames
  if (frameCount % 100 == 0) {
    pipes.push(new Pipe());
  }
  
  // Display and update score
  textSize(32);
  fill(255);
  text("Score: " + score, 10, 30);
  score++;
  
  // End game if bird hits top or bottom of canvas
  if (bird.y > height || bird.y < 0) {
    endGame();
  }
}

function keyPressed() {
  if (key == ' ') {
    bird.up();
  }
}

function endGame() {
  gameEnd = true;
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(255);
  text("Game Over", width/2, height/2);
  noLoop();
}

class Bird {
  constructor() {
    this.y = height/2;
    this.x = 64;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
  }

  show() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, 32, 32);
  }

  up() {
    this.velocity += this.lift;
  }

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
  }
}

class Pipe {
  constructor() {
    this.spacing = 125;
    this.top = random(height/6, 3/4*height);
    this.bottom = this.top + this.spacing;
    this.x = width;
    this.w = 80;
    this.speed = 4;
  }

  hits(bird) {
    if (bird.y < this.top || bird.y > this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  show() {
    fill(50, 200, 50);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }
}