const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');
const finalScore = document.getElementById('finalScore');
const scoreDisplay = document.getElementById('score');

// Assets
const basketImg = new Image();
basketImg.src = 'assets/basket.png';
const chickenImg = new Image();
chickenImg.src = 'assets/chicken.png';
const cluckSound = new Audio('assets/cluck.mp3');

// Game variables
let player = {x: canvas.width/2 - 40, y: canvas.height - 60, width: 80, height: 50, speed: 6};
let chickens = [];
let score = 0;
let keys = {};
let gameRunning = false;
let spawnInterval;

// Controls
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Spawn chicken
function spawnChicken() {
  const size = 40;
  const x = Math.random() * (canvas.width - size);
  const y = -size;
  chickens.push({x, y, size});
}

// Game loop
function update() {
  if(!gameRunning) return;

  // Move player
  if(keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if(keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += player.speed;

  // Move chickens
  chickens.forEach((chicken, index) => {
    chicken.y += 4;

    // Collision
    if(chicken.y + chicken.size > player.y &&
       chicken.x + chicken.size > player.x &&
       chicken.x < player.x + player.width) {
      score++;
      scoreDisplay.textContent = score;
      cluckSound.play();
      chickens.splice(index,1);
    }
    else if(chicken.y > canvas.height) {
      // Game over jika ayam jatuh
      endGame();
    }
  });

  draw();
  requestAnimationFrame(update);
}

// Draw
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(basketImg, player.x, player.y, player.width, player.height);
  chickens.forEach(chicken => ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.size, chicken.size));
}

// Start game
function startGame() {
  startScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  canvas.style.display = 'block';
  chickens = [];
  score = 0;
  scoreDisplay.textContent = score;
  gameRunning = true;
  spawnInterval = setInterval(spawnChicken, 1000);
  update();
}

// End game
function endGame() {
  gameRunning = false;
  clearInterval(spawnInterval);
  canvas.style.display = 'none';
  finalScore.textContent = score;
  gameOverScreen.style.display = 'flex';
}