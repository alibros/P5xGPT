const gameName="Flappy Bird"


let birdImage;
let bird, pipes = [];
let cloud = [];
let mountain = [];
let score = 0, highscore = 0;

// load bird image from local filesystem
function preload() {
    birdImage = loadImage('../images/bird.png');
}

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent('p5canvas'); // using "p5canvas" div as parent
    
    for (let i = 0; i < 4; i++) {
        cloud[i] = {
            x: random(0, 600),
            y: random(0, 200),
            size: random(50, 100),
            speed: random(0.1, 0.5)
        };
    }

    for (let i = 0; i < 3; i++) {
        mountain[i] = {
            x: random(-200, 0),
            y: 450 + i * 80,
            size: 400 - (i*80),
            speed: random(0.1, 0.5),
        }
    }

    bird = new Bird();
    pipes.push(new Pipe());
}

function draw() {
    let color1 = color(0, 0, 0);
    let color2 = color(200, 200, 200);
    let lerpAmt = map(sin(frameCount / 100), -1, 1, 0, 1);
    
    background(lerpColor(color1, color2, lerpAmt));

    // update and show clouds
    for (let i = 0; i < cloud.length; i++) {
        noStroke();
        fill(255);
        ellipse(cloud[i].x, cloud[i].y, cloud[i].size, cloud[i].size / 2);
        cloud[i].x += cloud[i].speed;

        if (cloud[i].x > width) {
            cloud[i].x = -cloud[i].size;
            cloud[i].y = random(0, 200);
            cloud[i].size = random(50, 100);
            cloud[i].speed = random(0.1, 0.5);
        }
    }

    //update and show mountains
    for (let i = 0; i < mountain.length; i++) {
        noStroke();
        fill(150,150,150)
        triangle(mountain[i].x, mountain[i].y - mountain[i].size,
                 mountain[i].x + mountain[i].size/2, mountain[i].y,
                 mountain[i].x + mountain[i].size, mountain[i].y - mountain[i].size)

        mountain[i].x += mountain[i].speed;

        if (mountain[i].x > width + mountain[i].size) {
            mountain[i].x = -mountain[i].size;
        }
    }

    // show grass
    noStroke();
    fill(0,200,0);
    rect(0, 550, width, 50);
    
    //display score
    fill('white')
    textSize(32)
    text(`Score: ${score}`, 10, 40)  
    
    //display highscore
    fill('pink')
    textSize(32)
    text(`Highscore: ${highscore}`, 350, 40)  

    // spawn pipes every 100 frames
    if (frameCount % 100 === 0) {
        pipes.push(new Pipe());
    }

    // update and show pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].show();

        // remove pipes if they go off screen
        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }

        // check for collision with bird
        if (pipes[i].hits(bird)) {
            console.log("game over");
            resetGame();
            break;
        }
        
        //calculate score
        if(pipes[i].bottomPipeHitsBird(bird)){
            score++
            highscore = max(highscore, score)
        }
        
    }

    // update and show bird
    bird.update();
    bird.show();
}

function keyPressed() {
    // flap the bird on spacebar press
    if (key === ' ') {
        bird.up();
    }
}

function Bird() {
    this.x = 70;
    this.y = height / 2;
    this.velocity = 0;
    this.gravity = 0.6;
    this.lift = -10;
    this.radius = 16;

    this.show = function () {
        imageMode(CENTER);
        image(birdImage, this.x, this.y, birdImage.width / 20, birdImage.height / 20);
    }

    this.up = function () {
        this.velocity += this.lift;
    }

    this.update = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;
        // keep bird within screen bounds
        if (this.y > height - this.radius) {
            this.y = height - this.radius;
            this.velocity = 0;
        } else if (this.y < this.radius) {
            this.y = this.radius;
            this.velocity = 0;
        }
    }
}

function Pipe() {
    this.gap = 150; // gap between the upper and lower pipes
    this.top = random(this.gap + 20, height / 2);
    this.bottom = height - this.top - this.gap; // keep the total height of pipes 600
    this.x = width;
    this.width = 30;
    this.speed = 4;
    // randomly generating RGB colors 
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);

    this.show = function () {
        fill(this.r, this.g, this.b);
        rect(this.x, 0, this.width, this.top); // update pipe height as top
        rect(this.x, height - this.bottom, this.width, this.bottom); // update pipe height as bottom
    }

    this.update = function () {
        this.x -= this.speed;
    }

    this.offscreen = function () {
        return (this.x < -this.width);
    }

    this.hits = function (bird) {
        if (bird.y - bird.radius < this.top || bird.y + bird.radius > height - this.bottom) {
            if (bird.x + bird.radius > this.x && bird.x - bird.radius < this.x + this.width) {
                return true;
            }
        }
        return false;
    }
    
    //check collision with bottom pipe
    this.bottomPipeHitsBird = function (bird) {
        if (bird.x > this.x && bird.x < this.x + this.width) {
            if (bird.y > height - this.bottom) {
                return true;
            }
        }
        return false;
    }
}

function resetGame() {
    bird = new Bird();
    pipes = [];
    score = 0

    pipes.push(new Pipe());
}