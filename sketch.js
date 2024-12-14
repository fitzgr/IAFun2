let circles = []; // Array to store circle objects
let randomImage; // To store the current random image
let showImage = false; // Flag to control image display
let imageStartTime; // To track when image started showing
let tickerX;
const TICKER_HEIGHT = 40;
let currentQuote;

// Array of quotes
const quotes = [
    "Life is what happens while you're busy making other plans.",
    "The only way to do great work is to love what you do.",
    "Be the change you wish to see in the world.",
    "Every moment is a fresh beginning.",
    "Whatever you are, be a good one.",
    "Everything you can imagine is real.",
    "Make each day your masterpiece.",
    "Simplicity is the ultimate sophistication.",
    "Dream big and dare to fail.",
    "Keep your face always toward the sunshine."
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Start the image cycle
  setInterval(getNewImage, 3000); // Every 3 seconds
  // Initialize ticker position
  tickerX = width;
  // Get first random quote
  currentQuote = getRandomQuote();
  // Change quote every 10 seconds
  setInterval(updateQuote, 10000);
}

function getRandomQuote() {
  return quotes[floor(random(quotes.length))];
}

function updateQuote() {
  currentQuote = getRandomQuote();
  // Reset ticker position when quote changes
  tickerX = width;
}

function getNewImage() {
  loadImage('https://picsum.photos/400/400?random=' + random(1000), img => {
    randomImage = img;
    showImage = true;
    imageStartTime = millis();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tickerX = width;
}

function draw() {
  // Use semi-transparent background for trail effect
  background(220, 20);
  
  // Check if we should show the image
  if (showImage && randomImage) {
    if (millis() - imageStartTime < 3000) {
      imageMode(CENTER);
      image(randomImage, width/2, height/2);
    } else {
      showImage = false;
    }
  }
  
  // Update and display circles
  for (let i = circles.length - 1; i >= 0; i--) {
    circles[i].move();
    circles[i].display();
    circles[i].age();
    
    if (circles[i].isDead()) {
      circles.splice(i, 1);
    }
  }
  
  // Draw ticker
  drawTicker();
}

function drawTicker() {
  // Draw ticker background
  fill(0, 200);
  noStroke();
  rect(0, height - TICKER_HEIGHT, width, TICKER_HEIGHT);
  
  // Get current time with date
  let now = new Date();
  let currentTime = now.toLocaleTimeString();
  let currentDate = now.toLocaleDateString();
  let fullText = `Toronto, ON: ${currentDate} ${currentTime} | "${currentQuote}"`;
  
  // Draw ticker text
  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text(fullText, tickerX, height - TICKER_HEIGHT/2);
  
  // Move ticker
  tickerX -= 2;
  
  // Reset ticker position when it's completely off screen
  let textWidth = fullText.length * 12; // Approximate text width
  if (tickerX < -textWidth) {
    tickerX = width;
  }
}

class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.diameter = random(20, 60);
    this.speedX = random(-5, 5);
    this.speedY = random(-5, 5);
    this.color = color(random(255), random(255), random(255));
    this.lifespan = 15 * 60; // 15 seconds * 60 frames per second
    this.trail = [];
  }

  move() {
    this.trail.push({x: this.x, y: this.y});
    
    if (this.trail.length > 20) {
      this.trail.shift();
    }
    
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }
  }

  display() {
    noStroke();
    for (let i = 0; i < this.trail.length; i++) {
      let opacity = map(i, 0, this.trail.length, 0, 255);
      let size = map(i, 0, this.trail.length, 5, this.diameter);
      fill(red(this.color), green(this.color), blue(this.color), opacity);
      circle(this.trail[i].x, this.trail[i].y, size);
    }
    
    let opacity = map(this.lifespan, 0, 15 * 60, 0, 255);
    fill(red(this.color), green(this.color), blue(this.color), opacity);
    circle(this.x, this.y, this.diameter);
  }

  age() {
    this.lifespan--;
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function mousePressed() {
  circles.push(new Circle(mouseX, mouseY));
}
