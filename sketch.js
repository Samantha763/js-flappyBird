let bird;
let pipes = [];
let score = 0;
let gameSpeed = 2;
let gameOver = false;

function setup() {
  createCanvas(400, 600);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(220);
  
  // Update and show bird
  bird.update();
  bird.show();
  
  // Move and show pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();
    
    // Check for collision with bird
    if (pipes[i].hits(bird)) {
      console.log("HIT");
      gameOver = true;
    }
    
    // Remove pipes if off screen
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
    
    // Increase score if bird passed pipe
    if (pipes[i].passed(bird)) {
      score++;
    }
  }
  
  // Display score
  fill(255);
  textSize(32);
  text(score, 10, 50);
  
  // Check for game over
  if (bird.y > height || bird.y < 0) {
    gameOver = true;
  }
  
  if (gameOver) {
    textSize(64);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
    noLoop();
  }
  
  // Add new pipe every 100 frames
  if (frameCount % 100 == 0 && !gameOver) {
    pipes.push(new Pipe());
  }
}

function keyPressed() {
  if (key == ' ' && !gameOver) {
    bird.up();
  }
}

class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
  }
  
  show() {
    fill(255);
    ellipse(this.x, this.y, 32, 32);
  }
  
  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
    
    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
  
  up() {
    this.velocity += this.lift;
  }
}

class Pipe {
  constructor() {
    this.top = random(height / 2);
    this.bottom = random(height / 2);
    this.x = width;
    this.w = 20;
    this.speed = gameSpeed;
    this.highlight = false;
  }
  
  show() {
    fill(255);
    if (this.highlight) {
      fill(255, 0, 0);
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }
  
  update() {
    this.x -= this.speed;
  }
  
  offscreen() {
    return this.x < -this.w;
  }
  
  hits(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }
  
  passed(bird) {
    if (bird.x > this.x && bird.x < this.x + this.w && !this.highlight) {
      return true;
    }
    return false;
  }
}
