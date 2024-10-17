let spriteSheet;
let francePNG;
let secondPNG;
let thirdPNG;
let fourthPNG;
let fifthPNG;
let sixthPNG;
let seventhPNG;
let eigthPNG;
let ninthPNG;
let backgroundImg;
let groundImg; 
let world;
let cameraObj;
let character;
let ground;

let frameIndex = 0;
let frameCount = 8; 
let frameCols = 3;  
let frameRows = 3;  
let frameWidth;
let frameHeight;
let frameDelay = 10;
let animationCounter = 0;

let facingRight = true;

let blueHeight = 0;
let whiteHeight = 0;
let redHeight = 0;
let flagSpeed = 5;

let showFlag = false;

let waveAmplitude = 8;
let waveFrequency = 0.001;
let waveSpeed = 0.001;

let pngObjects = []; 

let confettiParticles = [];
let confettiActive = false;
let confettiStarted = false;
let mp = 150; 
let angle = 0;
let wasMoving = false; 

let particleColors = {
  colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue",
    "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
  colorIndex: 0,
  colorIncrementer: 0,
  colorThreshold: 10,
  getColor: function () {
    if (this.colorIncrementer >= this.colorThreshold) {
      this.colorIncrementer = 0;
      this.colorIndex = (this.colorIndex + 1) % this.colorOptions.length;
    }
    this.colorIncrementer++;
    return this.colorOptions[this.colorIndex];
  }
};

let showChart = false;
let chart;
let chartAnimationStarted = false;

let showPieChart = false;
let pieChart;
let pieChartAnimationStarted = false;

let nearbyPng = null;

let flagYOffsetFrance = -400;    
let flagYOffsetMorocco = -400;  
let flagYOffsetSpain = -400;      
let flagAnimationSpeed = 5;      

// Preload Assets
function preload() {
  spriteSheet = loadImage('photos/W1.png', 
    () => console.log('W1.png loaded successfully.'), 
    () => console.error('Failed to load W1.png.')
  ); 
  francePNG = loadImage('photos/dansang.png'); 
  secondPNG = loadImage('photos/Eiffle.png', 
    () => console.log('Eiffle.png loaded successfully.'), 
    () => console.error('Failed to load Eiffle.png.')
  ); 
  thirdPNG = loadImage('photos/louvre.png'); 
  fourthPNG = loadImage('photos/tree.png'); 
  fifthPNG = loadImage('photos/music.png'); 
  sixthPNG = loadImage('photos/keyarrow1.png'); 
  seventhPNG = loadImage('photos/XG1.png');
  eigthPNG = loadImage('photos/Tree2.png');
  ninthPNG = loadImage('photos/Tree3.png');
  backgroundImg = loadImage('photos/background2.png', 
    () => console.log('background2.png loaded successfully.'), 
    () => console.error('Failed to load background2.png.')
  ); 
  groundImg = loadImage('photos/background2.png', 
    () => console.log('ground.png loaded successfully.'), 
    () => console.error('Failed to load ground.png.')
  ); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Calculate frame dimensions based on sprite sheet layout
  frameWidth = spriteSheet.width / frameCols;
  frameHeight = spriteSheet.height / frameRows;

  // Define the world dimensions
  world = {
    width: 5000, 
    width1: 100,
    height: height,
  };

  // Initialize the camera object
  cameraObj = {
    x: 0,
    y: 0,
    targetY: 0,
    width: width,
    height: height,
  };

  // Initialize the character object
  character = {
    width: frameWidth * 0.5,
    height: frameHeight * 0.5,
    x: world.width1, 
    y: 0,
    speed: 9,
    dx: 0,
  };

  // Define the ground
  ground = {
    x: 0,
    y: height - 50,
    width: world.width,
    height: 50,
  };

  // Position the character on the ground
  character.y = ground.y - character.height + 20; 

  // Create the PNG objects and add them to the pngObjects array
  let pngObject1 = new PNGObject(francePNG, 700, 480, 700, 800, 'france');
  let pngObject2 = new PNGObject(secondPNG, 2000, 850, 930, 1030, 'second');
  let pngObject3 = new PNGObject(thirdPNG, 3300, 850, 1300, 1400, 'third');
  let pngObject4 = new PNGObject(fourthPNG, 75, 740, 1000, 1100, 'fourth');
  let pngObject5 = new PNGObject(fifthPNG, 4300, 480, 700, 800, 'fifth');
  let pngObject6 = new PNGObject(sixthPNG, 0, 970, 500, 650, 'sixth');
  let pngObject7 = new PNGObject(seventhPNG, 1600, 1090, 800, 900, 'seventh');
  let pngObject8 = new PNGObject(eigthPNG, 1500, 550, 800, 900, 'eigth');
  let pngObject9 = new PNGObject(ninthPNG, 1450, 830, 1300, 1400, 'ninth');

  pngObjects.push(pngObject1, pngObject2, pngObject3, pngObject4, pngObject5, pngObject6, pngObject7, pngObject8, pngObject9);

  // Initialize the Bar Chart
  chart = new ChartAnimation();

  // Initialize the Pie Chart
  pieChart = new PieChartAnimation([
    { y: 17, label: "Morocco", color: "#FF6384" },
    { y: 16, label: "Spain", color: "#36A2EB" },
    { y: 14, label: "France", color: "#FFCE56" },
    { y: 7, label: "USA", color: "#4BC0C0" },
    { y: 7, label: "Japan", color: "#9966FF" }
  ], width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  cameraObj.width = width;
  cameraObj.height = height;
  ground.y = height - ground.height;
  character.y = ground.y - character.height + 10; 

  // Adjust PNG positions based on their yOffset
  for (let pngObject of pngObjects) {
    pngObject.updatePosition();
  }

  // Update chart position on resize
  chart.chartX = width / 2 - chart.chartWidth / 2 - chart.padding;
  chart.chartY = height / 4 - chart.chartHeight / 2 - chart.padding;

  // Update Pie Chart dimensions
  pieChart.centerX = width / 2;
  pieChart.centerY = height / 2;
  pieChart.radius = min(pieChart.centerX, pieChart.centerY) - 60;
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    character.dx = character.speed;
    facingRight = true;
  } else if (keyCode === LEFT_ARROW) {
    character.dx = -character.speed;
    facingRight = false;
  } 
  // **Handle 'Q' Key Press for Chart Display**
  else if (key === 'Q' || key === 'q') {
    if (nearbyPng && nearbyPng.type === 'second') {
      if (!showChart) { 
        showChart = true;
        chart.startAnimation();
        chartAnimationStarted = true;
      }
    } else if (nearbyPng && nearbyPng.type === 'third') {
      if (!showPieChart) { 
        showPieChart = true;
        pieChart.startAnimation();
        pieChartAnimationStarted = true;
      }
    }
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    character.dx = 0;
  }
}

function update() {
  character.x += character.dx;

  // Keep character within world boundaries
  if (character.x < 0) character.x = 0;
  if (character.x + character.width > world.width)
    character.x = world.width - character.width;

  // Camera follows the character
  cameraObj.x = character.x + character.width / 2 - width / 2;

  // Keep camera within world boundaries
  if (cameraObj.x < 0) cameraObj.x = 0;
  if (cameraObj.x + cameraObj.width > world.width)
    cameraObj.x = world.width - cameraObj.width;

  // Update animation frame
  animateCharacter();

  // Detect if character is near any PNG image
  showFlag = false; 
  nearbyPng = null; 
  for (let pngObject of pngObjects) {
    if (
      character.x + character.width > pngObject.x &&
      character.x < pngObject.x + pngObject.width &&
      character.y + character.height > pngObject.y &&
      character.y < pngObject.y + pngObject.height
    ) {
      showFlag = pngObject.type;
      nearbyPng = pngObject;
      break;
    }
  }

  // Handle flag animation based on PNG type
  if (showFlag === 'france') {
  } else {
    flagYOffsetFrance = -300;
    flagYOffsetMorocco = -300;
    flagYOffsetSpain = -300; 
  }

  if (showChart && (!nearbyPng || nearbyPng.type !== 'second')) {
    showChart = false;
    chart.resetAnimation();
    chartAnimationStarted = false;
  }

  if (showPieChart && (!nearbyPng || nearbyPng.type !== 'third')) {
    showPieChart = false;
    pieChart.reset();
    pieChartAnimationStarted = false;
  }

  // Confetti activation logic
  if (character.dx !== 0 && !wasMoving) {
    if (!confettiActive) {
      confettiActive = true;
      confettiStarted = true;
      initializeConfetti();
    }
  } else {
    confettiStarted = false; 
  }

  wasMoving = character.dx !== 0;
}

function animateCharacter() {
  if (character.dx !== 0) {
    animationCounter++;
    if (animationCounter > frameDelay) {
      frameIndex = (frameIndex + 1) % frameCount; 
      animationCounter = 0;
    }
  } else {
    frameIndex = 0; 
  }
}

function drawFlags(pngObject) {
  // Common flag properties
  let flagWidth = 400;
  let flagHeight = 300;
  let waveAmp = waveAmplitude;
  let waveFreq = waveFrequency;
  let waveSpd = waveSpeed;
  let segments = 20;

  // French Flag
  let franceFlagX = pngObject.x + pngObject.width / 2 - flagWidth - 10; 
  let franceFlagY = pngObject.y - flagHeight - 20 + flagYOffsetFrance;

  // Moroccan Flag
  let moroccoFlagX = pngObject.x + pngObject.width / 2 + 10;
  let moroccoFlagY = pngObject.y - flagHeight - 20 + flagYOffsetMorocco;

  // Spanish Flag
  let spainFlagX = pngObject.x + pngObject.width / 2 - flagWidth - 430; 
  let spainFlagY = pngObject.y - flagHeight - 20 + flagYOffsetSpain;

  // Animate French Flag Y-Offset
  if (flagYOffsetFrance < 0) {
    flagYOffsetFrance += flagAnimationSpeed;
    if (flagYOffsetFrance > 0) flagYOffsetFrance = 0; 
  }

  // Animate Moroccan Flag Y-Offset
  if (flagYOffsetMorocco < 0) {
    flagYOffsetMorocco += flagAnimationSpeed;
    if (flagYOffsetMorocco > 0) flagYOffsetMorocco = 0; 
  }

  // Animate Spanish Flag Y-Offset
  if (flagYOffsetSpain < 0) {
    flagYOffsetSpain += flagAnimationSpeed;
    if (flagYOffsetSpain > 0) flagYOffsetSpain = 0;
  }

  // Draw French Flag
  drawFrenchFlag(franceFlagX, franceFlagY, flagWidth, flagHeight, waveAmp, waveFreq, waveSpd, segments);

  // Draw Moroccan Flag
  drawMoroccanFlag(moroccoFlagX, moroccoFlagY, flagWidth, flagHeight, waveAmp, waveFreq, waveSpd, segments);

  // Draw Spanish Flag
  drawSpanishFlag(spainFlagX, spainFlagY, flagWidth, flagHeight, waveAmp, waveFreq, waveSpd, segments);
}

/**
 * Function to draw the French flag with waving effect
 * @param {number} flagX - X-coordinate of the flag's top-left corner
 * @param {number} flagY - Y-coordinate of the flag's top-left corner
 * @param {number} flagWidth - Width of the flag
 * @param {number} flagHeight - Height of the flag
 * @param {number} waveAmp - Amplitude of the wave
 * @param {number} waveFreq - Frequency of the wave
 * @param {number} waveSpd - Speed of the wave
 * @param {number} seg - Number of segments for the wave
 */
function drawFrenchFlag(flagX, flagY, flagWidth, flagHeight, waveAmp, waveFreq, waveSpd, seg) {
  // Colors for the French flag
  let colors = [
    color(0, 85, 164),    // Blue
    color(255, 255, 255), // White
    color(239, 65, 53)    // Red
  ];

  let stripeWidth = flagWidth / 3;

  let time = millis() * waveSpd;

  for (let i = 0; i < 3; i++) {
    let stripeX = flagX + i * stripeWidth;
    let stripeColor = colors[i];
    let currentHeight = flagHeight; 

    fill(stripeColor);
    noStroke();
    beginShape();
    for (let j = 0; j <= seg; j++) {
      let y = map(j, 0, seg, flagY, flagY + flagHeight);
      let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + time);
      let x = stripeX + offsetX;
      vertex(x, y);
    }
    for (let j = seg; j >= 0; j--) {
      let y = map(j, 0, seg, flagY, flagY + flagHeight);
      let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + time);
      let x = stripeX + stripeWidth + offsetX;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

/**
 * Function to draw the Moroccan flag with waving effect
 * @param {number} flagX - X-coordinate of the flag's top-left corner
 * @param {number} flagY - Y-coordinate of the flag's top-left corner
 * @param {number} flagWidth - Width of the flag
 * @param {number} flagHeight - Height of the flag
 * @param {number} waveAmp - Amplitude of the wave
 * @param {number} waveFreq - Frequency of the wave
 * @param {number} waveSpd - Speed of the wave
 * @param {number} seg - Number of segments for the wave
 */
function drawMoroccanFlag(flagX, flagY, flagWidth, flagHeight, waveAmp, waveFreq, waveSpd, seg) {
  // Colors for the Moroccan flag
  let backgroundColor = color('#C1272D'); // Red
  let starColor = '#008000';       // Green
  let starStrokeColor = '#FFFFFF'; // White stroke

  // Draw red background with waving effect
  fill(backgroundColor);
  noStroke();
  beginShape();
  for (let j = 0; j <= seg; j++) {
    let y = map(j, 0, seg, flagY, flagY + flagHeight);
    let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + millis() * waveSpd);
    let x = flagX + offsetX;
    vertex(x, y);
  }
  for (let j = seg; j >= 0; j--) {
    let y = map(j, 0, seg, flagY, flagY + flagHeight);
    let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + millis() * waveSpd);
    let x = flagX + flagWidth + offsetX;
    vertex(x, y);
  }
  endShape(CLOSE);

  // Calculate center of the flag
  let centerX = flagX + flagWidth / 2;
  let centerY = flagY + flagHeight / 2;
  let starSize = flagHeight / 2.5; 

  // Draw the green five-pointed star (Seal of Solomon)
  drawStar(centerX, centerY, starSize / 2, starSize, 5, starColor, starStrokeColor);
}

/**
 * Function to draw the Spanish flag with waving effect
 * @param {number} flagX - X-coordinate of the flag's top-left corner
 * @param {number} flagY - Y-coordinate of the flag's top-left corner
 * @param {number} flagWidth - Width of the flag
 * @param {number} flagHeight - Height of the flag
 * @param {number} waveAmp - Amplitude of the wave
 * @param {number} waveFreq - Frequency of the wave
 * @param {number} waveSpd - Speed of the wave
 * @param {number} seg - Number of segments for the wave
 */
function drawSpanishFlag(flagX, flagY, flagWidth, flagHeight, waveAmp, waveFreq, waveSpd, seg) {
  // Colors for the Spanish flag
  let redColor = '#AA151B';    // Spanish red
  let yellowColor = '#F1BF00'; // Spanish yellow

  // Define stripe proportions
  let redStripeHeight = flagHeight / 4;    
  let yellowStripeHeight = flagHeight / 2; 

  fill(redColor);
  noStroke();
  beginShape();
  for (let j = 0; j <= seg; j++) {
    let y = map(j, 0, seg, flagY, flagY + redStripeHeight);
    let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + millis() * waveSpd);
    let x = flagX + offsetX;
    vertex(x, y);
  }
  for (let j = seg; j >= 0; j--) {
    let y = map(j, 0, seg, flagY, flagY + redStripeHeight);
    let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + millis() * waveSpd);
    let x = flagX + flagWidth + offsetX;
    vertex(x, y);
  }
  endShape(CLOSE);

  // Animate and draw yellow middle stripe
  fill(yellowColor);
  beginShape();
  for (let j = 0; j <= seg; j++) {
    let y = map(j, 0, seg, flagY + redStripeHeight, flagY + redStripeHeight + yellowStripeHeight);
    let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + millis() * waveSpd);
    let x = flagX + offsetX;
    vertex(x, y);
  }
  for (let j = seg; j >= 0; j--) {
    let y = map(j, 0, seg, flagY + redStripeHeight, flagY + redStripeHeight + yellowStripeHeight);
    let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + millis() * waveSpd);
    let x = flagX + flagWidth + offsetX;
    vertex(x, y);
  }
  endShape(CLOSE);

  // Animate and draw red bottom stripe
  fill(redColor);
  beginShape();
  for (let j = 0; j <= seg; j++) {
    let y = map(j, 0, seg, flagY + redStripeHeight + yellowStripeHeight, flagY + flagHeight);
    let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + millis() * waveSpd);
    let x = flagX + offsetX;
    vertex(x, y);
  }
  for (let j = seg; j >= 0; j--) {
    let y = map(j, 0, seg, flagY + redStripeHeight + yellowStripeHeight, flagY + flagHeight);
    let offsetX = waveAmp * sin(TWO_PI * waveFreq * y + millis() * waveSpd);
    let x = flagX + flagWidth + offsetX;
    vertex(x, y);
  }
  endShape(CLOSE);
}

/**
 * Function to draw a star
 * @param {number} x - Center x-coordinate
 * @param {number} y - Center y-coordinate
 * @param {number} radius1 - Inner radius
 * @param {number} radius2 - Outer radius
 * @param {number} npoints - Number of points
 * @param {string} fillCol - Fill color
 * @param {string} strokeCol - Stroke color
 */
function drawStar(x, y, radius1, radius2, npoints, fillCol, strokeCol) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  fill(fillCol);
  stroke(strokeCol);
  strokeWeight(2);
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// Confetti particle class
class ConfettiParticle {
  constructor(color) {
    this.x = random(width);
    this.y = random(-height, 0);
    this.r = random(10, 30);
    this.d = random(mp) + 10;
    this.color = color;
    this.tilt = random(-10, 0);
    this.tiltAngleIncremental = random(0.05, 0.12);
    this.tiltAngle = 0;
  }

  drawParticle() {
    strokeWeight(this.r / 2);
    stroke(this.color);
    line(
      this.x + this.tilt + (this.r / 4),
      this.y,
      this.x + this.tilt,
      this.y + this.tilt + (this.r / 4)
    );
  }

  updateParticle() {
    this.tiltAngle += this.tiltAngleIncremental;
    this.y += (cos(angle + this.d) + 3 + this.r / 2) / 2;
    this.x += sin(angle);
    this.tilt = sin(this.tiltAngle) * 15;
  }
}

function initializeConfetti() {
  confettiParticles = [];
  for (let i = 0; i < mp; i++) {
    let particleColor = particleColors.getColor();
    confettiParticles.push(new ConfettiParticle(particleColor));
  }
}

// PNGObject Class
class PNGObject {
  constructor(image, x, yOffset, width, height, type) {
    this.image = image;
    this.x = x;
    this.yOffset = yOffset;
    this.width = width;
    this.height = height;
    this.type = type;
    this.y = ground.y - this.yOffset;
  }

  updatePosition() {
    this.y = ground.y - this.yOffset;
  }

  display() {
    image(this.image, this.x, this.y, this.width, this.height);
  }
}

// ChartAnimation Class (Bar Chart)
class ChartAnimation {
  constructor() {
    this.countries = [
      { label: "France", xg: 2.08, xa: 1.30 },
      { label: "Spain", xg: 1.79, xa: 1.52 },
      { label: "Argentina", xg: 1.57, xa: 0.90 },
      { label: "Uzbekistan", xg: 1.55, xa: 1.30 },
      { label: "Guinea", xg: 1.53, xa: 1.58 },
      { label: "Morocco", xg: 1.43, xa: 1.11 },
      { label: "Paraguay", xg: 1.40, xa: 1.58 },
      { label: "Egypt", xg: 1.39, xa: 1.80 },
      { label: "USA", xg: 1.33, xa: 1.45 },
      { label: "Ukraine", xg: 1.32, xa: 1.23 }
    ];

    // Chart dimensions
    this.chartWidth = 1200;  
    this.chartHeight = 800;  
    this.padding = 50;       
    this.barWidth = 40;      
    this.barSpacing = 120;   
    this.yAxisStep = 0.2;
    this.maxYValue = 3;

    this.progress = 0; // Animation progress
    this.animationComplete = false;

    // Initial position
    this.chartX = width / 2 - this.chartWidth / 2 - this.padding;
    this.chartY = height / 4 - this.chartHeight / 2 - this.padding;
  }

  // Start the animation by resetting progress
  startAnimation() {
    this.progress = 0;
    this.animationComplete = false;
  }

  // Reset the animation
  resetAnimation() {
    this.progress = 0;
    this.animationComplete = false;
  }

  // Draw the bar chart
  drawChart() {
    // Draw semi-transparent white background
    push();
    fill(255, 255, 255, 220);
    noStroke();
    rectMode(CORNER);
    rect(this.chartX, this.chartY, this.chartWidth + this.padding * 2, this.chartHeight + this.padding * 2, 20);
    pop();

    // Draw the main title
    push();
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(100);
    text("Bar Chart: Expected Goals Analysis", this.chartX + this.chartWidth / 2 + this.padding, this.chartY - 30);
    pop();

    // Translate to chart drawing area
    push();
    translate(this.chartX + this.padding, this.chartY + this.padding);

    // Update progress
    if (!this.animationComplete) {
      this.progress += 0.02; 

      // Clamp progress to 1
      if (this.progress >= 1) {
        this.progress = 1;
        this.animationComplete = true;
      }
    }

    // Draw XG bars
    fill('#4F81BC'); // Blue bars for XG
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    this.countries.forEach((country, index) => {
      const xgHeight = (country.xg / this.maxYValue) * this.chartHeight * this.progress;
      const x = index * this.barSpacing;
      const y = this.chartHeight - xgHeight;
      rect(x, y, this.barWidth, xgHeight);

      // Draw country label below bars
      fill('#000000');
      text(country.label, x + this.barWidth / 2, this.chartHeight + 30);
      fill('#4F81BC'); 
    });

    // Draw XA bars
    fill('#C0504E'); // Red bars for XA
    this.countries.forEach((country, index) => {
      const xaHeight = (country.xa / this.maxYValue) * this.chartHeight * this.progress;
      const x = index * this.barSpacing + this.barWidth;
      const y = this.chartHeight - xaHeight;
      rect(x, y, this.barWidth, xaHeight);
    });

    // Draw Y-axis
    stroke('#000000');
    strokeWeight(3);
    line(0, 0, 0, this.chartHeight); // Y-axis
    line(0, this.chartHeight, this.chartWidth, this.chartHeight); // X-axis

    // Draw Y-axis labels and ticks
    noStroke();
    fill('#000000');
    textSize(24);
    for (let i = 0; i <= this.maxYValue / this.yAxisStep; i++) {
      const labelValue = (i * this.yAxisStep).toFixed(1);
      const yPos = this.chartHeight - (i * (this.chartHeight / (this.maxYValue / this.yAxisStep)));
      text(labelValue, -40, yPos);
      stroke('#000000');
      line(-10, yPos, 0, yPos); 
      noStroke();
    }

    this.drawColorLegend();

    pop();
  }

  drawColorLegend() {
    const legendX = this.chartWidth + 60;
    const legendY = 0;
    textAlign(LEFT, CENTER);
    textSize(24);
    fill(0);
    text("Countries:", legendX, legendY + 100);

    // Blue for XG
    fill('#4F81BC');
    rect(legendX, legendY - 10, 20, 20);
    fill(0);
    text("Blue: XG (Expected Goals Rate)", legendX + 30, legendY + 0);

    // Red for XA
    fill('#C0504E');
    rect(legendX, legendY + 20, 20, 20);
    fill(0);
    text("Red: XGA (Expected Goals Against)", legendX + 30, legendY + 30);
  }
}

// PieChartAnimation Class (Enhanced to Persist After Animation)
class PieChartAnimation {
  constructor(dataPoints, canvasWidth, canvasHeight) {
    this.dataPoints = dataPoints;
    this.total = this.dataPoints.reduce((sum, dp) => sum + dp.y, 0);
    this.centerX = canvasWidth / 2;
    this.centerY = canvasHeight / 2;
    this.radius = min(this.centerX, this.centerY) - 60;

    this.currentSlice = 0;
    this.animationProgress = 0;
    this.animationSpeed = 0.02; 

    this.animationComplete = false;
  }

  startAnimation() {
    this.currentSlice = 0;
    this.animationProgress = 0;
    this.animationComplete = false;
  }

  // Reset the animation
  reset() {
    this.currentSlice = 0;
    this.animationProgress = 0;
    this.animationComplete = false;
  }

  drawSlice(dp, sliceStartAngle, sliceEndAngle, progress) {
    let animatedEndAngle = sliceStartAngle + (sliceEndAngle - sliceStartAngle) * progress;
    fill(dp.color);
    noStroke();
    beginShape();
    vertex(this.centerX, this.centerY);
    arc(this.centerX, this.centerY, this.radius * 2, this.radius * 2, sliceStartAngle, animatedEndAngle);
    endShape(CLOSE);
  }

  // Draw labels for a slice
  drawLabel(dp, sliceStartAngle, sliceEndAngle, progress) {
    let animatedEndAngle = sliceStartAngle + (sliceEndAngle - sliceStartAngle) * progress;
    let midAngle = sliceStartAngle + (animatedEndAngle - sliceStartAngle) / 2;
    let labelRadius = this.radius - 30;
    let labelX = this.centerX + labelRadius * cos(midAngle);
    let labelY = this.centerY + labelRadius * sin(midAngle);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(30);
    text(`${dp.label} - ${dp.y}%`, labelX, labelY);
  }

  // Animate the pie chart
  animate() {
    push();
    fill(255, 255, 255, 200); 
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);
    pop();

    // Draw the main title
    push();
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Top 5 Goals Conceded Rate", this.centerX, this.centerY - this.radius - 40);
    pop();

    let tempStartAngle = -HALF_PI; // Start at the top

    // Draw all completed slices
    for (let i = 0; i < this.currentSlice; i++) {
      let dp = this.dataPoints[i];
      let sliceAngle = (dp.y / this.total) * TWO_PI;
      this.drawSlice(dp, tempStartAngle, tempStartAngle + sliceAngle, 1);
      this.drawLabel(dp, tempStartAngle, tempStartAngle + sliceAngle, 1);
      tempStartAngle += sliceAngle;
    }

    // Animate the current slice
    if (this.currentSlice < this.dataPoints.length) {
      let dp = this.dataPoints[this.currentSlice];
      let sliceAngle = (dp.y / this.total) * TWO_PI;
      this.drawSlice(dp, tempStartAngle, tempStartAngle + sliceAngle, this.animationProgress);
      this.drawLabel(dp, tempStartAngle, tempStartAngle + sliceAngle, this.animationProgress);
      this.animationProgress += this.animationSpeed;
      if (this.animationProgress >= 1) {
        this.animationProgress = 0;
        this.currentSlice++;
      }
      tempStartAngle += sliceAngle;
    }

    // After animation is complete, draw remaining slices fully
    if (this.animationComplete === false && this.currentSlice >= this.dataPoints.length) {
      this.animationComplete = true;
    }

    // If animation is complete, ensure all slices are drawn
    if (this.animationComplete) {
      // Reset start angle
      tempStartAngle = -HALF_PI;
      for (let i = 0; i < this.dataPoints.length; i++) {
        let dp = this.dataPoints[i];
        let sliceAngle = (dp.y / this.total) * TWO_PI;
        this.drawSlice(dp, tempStartAngle, tempStartAngle + sliceAngle, 1);
        this.drawLabel(dp, tempStartAngle, tempStartAngle + sliceAngle, 1);
        tempStartAngle += sliceAngle;
      }
    }

    this.drawLegend();
  }

  drawLegend() {
    let legendX = this.centerX + this.radius + 20;
    let legendY = this.centerY - this.radius;
    textAlign(LEFT, CENTER);
    textSize(16);
    fill(0);
    text("Countries:", legendX, legendY - 20);

    this.dataPoints.forEach((dp, index) => {
      fill(dp.color);
      rect(legendX, legendY + index * 25, 20, 20);
      fill(0);
      text(dp.label, legendX + 30, legendY + index * 25 + 10);
    });
  }
}

function draw() {
  update();

  clear();

  push();

  translate(-cameraObj.x, -cameraObj.y);

  // Draw the background image covering the entire world width
  image(backgroundImg, 0, 0, world.width, height);

  // Draw the ground image
  image(groundImg, ground.x, ground.y, ground.width, ground.height);

  // Draw the PNG images
  for (let pngObject of pngObjects) {
    pngObject.display();
  }

  // Character rendering logic
  let col = frameIndex % frameCols;
  let row = Math.floor(frameIndex / frameCols);
  let sx = col * frameWidth;
  let sy = row * frameHeight;

  if (facingRight) {
    image(
      spriteSheet,
      character.x,
      character.y,
      character.width,
      character.height,
      sx,
      sy,
      frameWidth,
      frameHeight
    );
  } else {
    // Flip character image when facing left
    push();
    translate(character.x + character.width, character.y);
    scale(-1, 1);
    image(
      spriteSheet,
      0,
      0,
      character.width,
      character.height,
      sx,
      sy,
      frameWidth,
      frameHeight
    );
    pop();
  }

  if (showFlag === 'france') {
    let francePngObject = pngObjects.find((obj) => obj.type === 'france');
    if (francePngObject) {
      drawFlags(francePngObject);
    }
  }

  pop();

  // Update and draw confetti particles
  if (confettiActive) {
    angle += 0.01;
    for (let i = 0; i < confettiParticles.length; i++) {
      confettiParticles[i].updateParticle();
      confettiParticles[i].drawParticle();

      // Reposition confetti particle if out of bounds
      if (
        confettiParticles[i].x > width + 20 ||
        confettiParticles[i].x < -20 ||
        confettiParticles[i].y > height
      ) {
        if (i % 5 > 0 || i % 2 === 0) {
          confettiParticles[i].x = random(width);
          confettiParticles[i].y = -10;
          confettiParticles[i].tilt = random(-10, 0);
        } else {
          if (sin(angle) > 0) {
            confettiParticles[i].x = -5;
            confettiParticles[i].y = random(height);
            confettiParticles[i].tilt = random(-10, 0);
          } else {
            confettiParticles[i].x = width + 5;
            confettiParticles[i].y = random(height);
            confettiParticles[i].tilt = random(-10, 0);
          }
        }
      }
    }
  }

  if (showChart) {
    chart.drawChart();
  }

  if (showPieChart) {
    pieChart.animate();
  }
}
