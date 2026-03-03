let arrObjs = [];
let arrLen = 20;
let sTxt = 0;

// GLOBAL TIME Asset
let globalTime = 0;
let tTxt = 10;

let arrParImgSrc = ["01.png", "02.png", "03.png", "04.png"];
let arrImgs = [];

let scene1 = true;
let scene2 = false;
let scene3 = false;
let scene4 = false;

// SCENE 4 items
let scene4Bg;

// SCENE 3 items
let scene3Bg;

// SCENE 2 items
let scene2Bg;
let timeLimit = 20;

// SCENE 1 items
let scene1Bg;

function preload() {
  arrImgs[0] = loadImage(arrParImgSrc[0]);
  arrImgs[1] = loadImage(arrParImgSrc[1]);
  arrImgs[2] = loadImage(arrParImgSrc[2]);
  arrImgs[3] = loadImage(arrParImgSrc[3]);

  // LOAD THE SCENE1 game sssests
  scene1Bg = loadImage("scene1_bg.png");

  // LOAD THE SCENE 2 game assets
  scene2Bg = loadImage("scene2_bg.png");

  // LOAD THE SCENE 3 game assets
  scene3Bg = loadImage("scene3_bg.png"); // WIN
  // LOAD THE SCENE 4 game assets
  scene4Bg = loadImage("scene4_bg.png"); // LOSE

  // LOAD GAME FONT
  gameFont = loadFont("ArgentPixelCF-Regular.otf");
}

function setup() {
  createCanvas(800, 800);

  noStroke();

  // Fill the array with particles
  for (let i = 0; i < arrLen; i++) {
    let obj = new MovingBall();
    arrObjs.push(obj);
  }
}

function draw() {
  background(220);
  // SCENE 1: WELCOME SCENE
  // gives instruction to the player
  // about how to play the game
  if (scene1 == true) {
    // Draw scene1 background image
    imageMode(CORNER);
    image(scene1Bg, 0, 0, width, height);

    // Global time
    globalTime = floor(millis() / 1000);
  }

  // SCENE 2 : GAME PLAY SCENE
  // if scene2 variable set to true
  // the player interacts with game actively
  if (scene2 == true) {
    // Draw scene2 background image
    imageMode(CORNER);
    image(scene2Bg, 0, 0, width, height);
    for (let i = 0; i < arrLen; i++) {
      let obj = new MovingBall();
      arrObjs[i].updatePosition();
      arrObjs[i].display();
    }

    // Measure the current time
    let cTime = floor(millis() / 1000) - globalTime;
    tTxt = timeLimit - cTime;

    if (tTxt <= 0) {
      print("Game finished, Your Score is : " + sTxt);
      scene3 = true;
      scene2 = false;
    }

    // Score Text display
    push();
    textAlign(LEFT);
    // Score text background rectangle
    fill(30);
    rect(0, 0, width, 45);
    // score text itself
    fill(255, 255, 255);
    textSize(32);
    textFont(gameFont);
    text("SCORE: " + sTxt, 10, 32);
    // display time txt
    text("TIME: " + tTxt, width - 140, 32);
    pop();
  }
  // END of GAME PLAY SCENE : Scene2

  if (scene3 == true) {
    imageMode(CORNER);

    // WIN or LOSE background
    if (sTxt >= 20) {
      image(scene3Bg, 0, 0, width, height); // WIN
    } else {
      image(scene4Bg, 0, 0, width, height); // LOSE
    }

    fill(255, 175, 220);
    textSize(40);
    textAlign(CENTER);
    textFont(gameFont);
    text("Your Score:", width / 2, 240);
    text(sTxt, width / 2, 270);
  }
}

function mousePressed() {
  // SCENE 1 > START GAME
  if (scene1 == true) {
    scene1 = false;
    scene2 = true;
    globalTime = floor(millis() / 1000);
    sTxt = 0;
    return;
  }

  // SCENE 2 > GAME PLAY
  if (scene2 == true) {
    for (let i = 0; i < arrObjs.length; i++) {
      let scoreChange = arrObjs[i].checkCollision(mouseX, mouseY);

      if (scoreChange !== 0) {
        sTxt += scoreChange;
        break; // stop after first hit
      }
    }
    return;
  }

  // SCENE 3 or SCENE 4 > RESTART GAME
  if (scene3 == true) {
    scene3 = false;
    scene2 = true;
    globalTime = floor(millis() / 1000);
    sTxt = 0;
  }
}

// DEFINE THE BALL CLASS (OBJECT)
class MovingBall {
  constructor() {
    this.sz = random(120, 180);

    this.x = random(0, width);
    this.y = this.sz / 2;

    this.speedX = random(-8, 8);

    this.speedY = random(1, 6);
    this.dirX = 1;
    this.dirY = 1;

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);

    this.rIndex = floor(random(0, 4));

    imageMode(CENTER);
  }

  updatePosition() {
    //this.x = this.x + this.speedX * this.dirX;
    this.y = this.y + this.speedY * this.dirY;

    // Checks the position of the circle
    // whether it hits the canvas edges or not
    // Check the horizontal part -> X
    if (this.x > width - this.sz * 0.5 || this.x < this.sz * 0.5) {
      this.dirX = this.dirX * -1;
    }

    // Check the vertical part -> Y
    if (this.y > height + this.sz * 0.5) {
      this.y = -this.sz / 2;
      this.x = random(0, width);
    }
  }

  display() {
    image(arrImgs[this.rIndex], this.x, this.y, this.sz, this.sz);
  }

  checkCollision(mx, my) {
    let d = dist(mx, my, this.x, this.y);

    if (d < this.sz / 2) {
      // reset particle position
      this.y = -this.sz / 2;
      this.x = random(0, width);
      this.speedY = random(0.1, 6);

      // scoring logic
      if (this.rIndex === 3) {
        return 1; // 04.png → +1 score
      } else {
        return -1; // 01–03.png → −1 score
      }
    }
    return 0; // no hit
  }
}
