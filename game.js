// Game State
let canvas, ctx;
let gameRunning = false;
let gamePaused = false;
let currentLevel = 1;
let score = 0;
let coins = 0;
let lives = 3;
let startTime;
let timerInterval;
let levelComplete = false;
let worldTime = 400; // 400 seconds per level

// Player Object (Mario)
let player = {
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    runSpeed: 8,
    jumpPower: -12,
    gravity: 0.5,
    grounded: false,
    facingRight: true,
    isBig: false,
    hasFire: false,
    invincible: false,
    invincibilityTimer: 0,
    powerup: 'none' // none, mushroom, flower, star
};

// Camera
let camera = {
    x: 0,
    y: 0,
    width: 800,
    height: 400
};

// Platforms (level blocks)
let platforms = [];

// Enemies
let enemies = [];

// Collectibles
let collectibles = [];

// Coins
let coinArray = [];

// Power-ups
let powerups = [];

// Keys
let keys = {
    left: false,
    right: false,
    space: false,
    shift: false
};

// Level Data
const levelData = {
    1: { // World 1-1: Grass Lands
        platforms: [
            // Ground
            { x: 0, y: 350, width: 800, height: 50, type: 'ground' },
            // Platforms
            { x: 200, y: 280, width: 100, height: 20, type: 'brick' },
            { x: 350, y: 240, width: 80, height: 20, type: 'brick' },
            { x: 500, y: 200, width: 80, height: 20, type: 'brick' },
            { x: 650, y: 240, width: 80, height: 20, type: 'brick' },
            // Question blocks
            { x: 250, y: 200, width: 40, height: 20, type: 'question', contains: 'coin' },
            { x: 400, y: 160, width: 40, height: 20, type: 'question', contains: 'mushroom' },
            // Pipe
            { x: 700, y: 300, width: 60, height: 50, type: 'pipe' }
        ],
        coins: [
            { x: 220, y: 250, width: 15, height: 15, collected: false },
            { x: 370, y: 210, width: 15, height: 15, collected: false },
            { x: 520, y: 170, width: 15, height: 15, collected: false }
        ],
        enemies: [
            { x: 300, y: 330, width: 20, height: 20, type: 'goomba', speed: 1, direction: 1, alive: true },
            { x: 450, y: 330, width: 20, height: 20, type: 'goomba', speed: 1, direction: 1, alive: true }
        ],
        background: 'grass'
    },
    2: { // World 1-2: Underground Cave
        platforms: [
            { x: 0, y: 350, width: 800, height: 50, type: 'ground' },
            { x: 150, y: 300, width: 80, height: 20, type: 'brick' },
            { x: 280, y: 260, width: 80, height: 20, type: 'brick' },
            { x: 410, y: 220, width: 80, height: 20, type: 'brick' },
            { x: 540, y: 260, width: 80, height: 20, type: 'brick' },
            { x: 670, y: 300, width: 80, height: 20, type: 'brick' },
            { x: 250, y: 180, width: 40, height: 20, type: 'question', contains: 'coin' },
            { x: 500, y: 140, width: 40, height: 20, type: 'question', contains: 'star' }
        ],
        coins: [
            { x: 170, y: 270, width: 15, height: 15, collected: false },
            { x: 300, y: 230, width: 15, height: 15, collected: false },
            { x: 430, y: 190, width: 15, height: 15, collected: false },
            { x: 560, y: 230, width: 15, height: 15, collected: false }
        ],
        enemies: [
            { x: 200, y: 330, width: 20, height: 20, type: 'goomba', speed: 1, direction: 1, alive: true },
            { x: 350, y: 330, width: 20, height: 20, type: 'goomba', speed: 1, direction: 1, alive: true },
            { x: 600, y: 330, width: 20, height: 20, type: 'koopa', speed: 1.5, direction: 1, alive: true }
        ],
        background: 'cave'
    },
    3: { // World 1-3: Sky Fortress
        platforms: [
            { x: 0, y: 350, width: 100, height: 20, type: 'cloud' },
            { x: 150, y: 300, width: 80, height: 20, type: 'cloud' },
            { x: 280, y: 250, width: 80, height: 20, type: 'cloud' },
            { x: 410, y: 200, width: 80, height: 20, type: 'cloud' },
            { x: 540, y: 150, width: 80, height: 20, type: 'cloud' },
            { x: 670, y: 200, width: 80, height: 20, type: 'cloud' },
            { x: 250, y: 100, width: 40, height: 20, type: 'question', contains: 'flower' }
        ],
        coins: [
            { x: 170, y: 270, width: 15, height: 15, collected: false },
            { x: 300, y: 220, width: 15, height: 15, collected: false },
            { x: 430, y: 170, width: 15, height: 15, collected: false },
            { x: 560, y: 120, width: 15, height: 15, collected: false }
        ],
        enemies: [
            { x: 200, y: 280, width: 20, height: 20, type: 'para-goomba', speed: 1, direction: 1, alive: true },
            { x: 450, y: 180, width: 20, height: 20, type: 'para-koopa', speed: 2, direction: 1, alive: true }
        ],
        background: 'sky'
    },
    4: { // World 1-4: Castle
        platforms: [
            { x: 0, y: 350, width: 200, height: 20, type: 'stone' },
            { x: 250, y: 300, width: 100, height: 20, type: 'stone' },
            { x: 400, y: 250, width: 100, height: 20, type: 'stone' },
            { x: 550, y: 200, width: 100, height: 20, type: 'stone' },
            { x: 700, y: 250, width: 100, height: 20, type: 'stone' },
            { x: 300, y: 150, width: 40, height: 20, type: 'question', contains: 'star' },
            { x: 500, y: 100, width: 40, height: 20, type: 'question', contains: '1up' }
        ],
        coins: [
            { x: 270, y: 270, width: 15, height: 15, collected: false },
            { x: 420, y: 220, width: 15, height: 15, collected: false },
            { x: 570, y: 170, width: 15, height: 15, collected: false }
        ],
        enemies: [
            { x: 300, y: 330, width: 20, height: 20, type: 'goomba', speed: 1, direction: 1, alive: true },
            { x: 450, y: 280, width: 20, height: 20, type: 'koopa', speed: 1.5, direction: 1, alive: true },
            { x: 600, y: 230, width: 30, height: 30, type: 'bowser', speed: 2, direction: 1, alive: true }
        ],
        background: 'castle'
    }
};

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    document.getElementById('sfxVolume').addEventListener('input', updateSFXVolume);
    document.getElementById('musicVolume').addEventListener('input', updateMusicVolume);
    
    showMainMenu();
});

// Menu Functions
function showMainMenu() {
    document.getElementById('mainMenu').classList.add('active');
    document.getElementById('levelSelect').classList.remove('active');
    document.getElementById('instructions').classList.remove('active');
    document.getElementById('settings').classList.remove('active');
    document.getElementById('gameScreen').classList.add('hidden');
    
    if (gameRunning) stopGame();
}

function showLevelSelect() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('levelSelect').classList.add('active');
    document.getElementById('instructions').classList.remove('active');
    document.getElementById('settings').classList.remove('active');
    document.getElementById('gameScreen').classList.add('hidden');
}

function showInstructions() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('levelSelect').classList.remove('active');
    document.getElementById('instructions').classList.add('active');
    document.getElementById('settings').classList.remove('active');
    document.getElementById('gameScreen').classList.add('hidden');
}

function showSettings() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('levelSelect').classList.remove('active');
    document.getElementById('instructions').classList.remove('active');
    document.getElementById('settings').classList.add('active');
    document.getElementById('gameScreen').classList.add('hidden');
}

// Game Functions
function startGame() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('gameScreen').classList.remove('hidden');
    loadLevel(1);
}

function loadLevel(level) {
    currentLevel = level;
    resetGame();
    
    const levelInfo = levelData[level];
    
    // Load platforms
    platforms = [...levelInfo.platforms];
    
    // Load coins
    coinArray = levelInfo.coins.map(c => ({...c, collected: false}));
    
    // Load enemies
    enemies = levelInfo.enemies.map(e => ({...e}));
    
    // Set world display
    document.getElementById('worldDisplay').textContent = `World 1-${level}`;
    
    // Position player
    player.x = 100;
    player.y = 330;
    
    startGameLoop();
}

function resetGame() {
    player.x = 100;
    player.y = 330;
    player.velocityX = 0;
    player.velocityY = 0;
    player.isBig = false;
    player.hasFire = false;
    player.invincible = false;
    player.powerup = 'none';
    
    lives = 3;
    score = 0;
    coins = 0;
    levelComplete = false;
    worldTime = 400;
    
    updateHUD();
    
    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function stopGame() {
    gameRunning = false;
    clearInterval(timerInterval);
}

function pauseGame() {
    if (!gameRunning || gamePaused) return;
    gamePaused = true;
    document.getElementById('pauseMenu').classList.remove('hidden');
}

function resumeGame() {
    gamePaused = false;
    document.getElementById('pauseMenu').classList.add('hidden');
}

function restartLevel() {
    document.getElementById('pauseMenu').classList.add('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('levelComplete').classList.add('hidden');
    loadLevel(currentLevel);
}

function restartFromWorld1() {
    document.getElementById('gameOver').classList.add('hidden');
    loadLevel(1);
}

function nextLevel() {
    if (currentLevel < 4) {
        loadLevel(currentLevel + 1);
    } else {
        alert('🎉 CONGRATULATIONS! You saved the princess! 🎉');
        showMainMenu();
    }
    document.getElementById('levelComplete').classList.add('hidden');
}

// Keyboard Handlers
function handleKeyDown(e) {
    if (!gameRunning || gamePaused || levelComplete) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = true;
            player.facingRight = false;
            e.preventDefault();
            break;
        case 'ArrowRight':
            keys.right = true;
            player.facingRight = true;
            e.preventDefault();
            break;
        case ' ':
        case 'Space':
            keys.space = true;
            e.preventDefault();
            break;
        case 'Shift':
            keys.shift = true;
            e.preventDefault();
            break;
        case 'Escape':
            pauseGame();
            break;
    }
}

function handleKeyUp(e) {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = false;
            e.preventDefault();
            break;
        case 'ArrowRight':
            keys.right = false;
            e.preventDefault();
            break;
        case ' ':
        case 'Space':
            keys.space = false;
            e.preventDefault();
            break;
        case 'Shift':
            keys.shift = false;
            e.preventDefault();
            break;
    }
}

// Game Loop
function startGameLoop() {
    gameRunning = true;
    gamePaused = false;
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!gameRunning) return;
    
    if (!gamePaused && !levelComplete) {
        update();
        updateCamera();
    }
    
    draw();
    
    requestAnimationFrame(gameLoop);
}

function update() {
    // Gravity
    player.velocityY += player.gravity;
    
    // Movement
    let currentSpeed = keys.shift ? player.runSpeed : player.speed;
    
    if (keys.left) {
        player.velocityX = -currentSpeed;
    } else if (keys.right) {
        player.velocityX = currentSpeed;
    } else {
        player.velocityX *= 0.7;
    }
    
    // Jump
    if (keys.space && player.grounded) {
        player.velocityY = player.jumpPower;
        player.grounded = false;
        playSound('jumpSound');
    }
    
    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Platform collision
    player.grounded = false;
    for (let platform of platforms) {
        if (player.velocityY >= 0 &&
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velocityY) {
            
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
            
            // Hit question block
            if (platform.type === 'question' && !platform.hit) {
                platform.hit = true;
                platform.type = 'brick';
                
                if (platform.contains === 'coin') {
                    coins++;
                    score += 100;
                    playSound('coinSound');
                } else if (platform.contains === 'mushroom') {
                    powerups.push({
                        x: platform.x,
                        y: platform.y - 20,
                        width: 20,
                        height: 20,
                        type: 'mushroom'
                    });
                } else if (platform.contains === 'flower') {
                    powerups.push({
                        x: platform.x,
                        y: platform.y - 20,
                        width: 20,
                        height: 20,
                        type: 'flower'
                    });
                } else if (platform.contains === 'star') {
                    powerups.push({
                        x: platform.x,
                        y: platform.y - 20,
                        width: 20,
                        height: 20,
                        type: 'star'
                    });
                } else if (platform.contains === '1up') {
                    lives++;
                    playSound('1upSound');
                }
            }
        }
    }
    
    // Power-up collision
    for (let i = powerups.length - 1; i >= 0; i--) {
        let power = powerups[i];
        if (player.x < power.x + power.width &&
            player.x + player.width > power.x &&
            player.y < power.y + power.height &&
            player.y + player.height > power.y) {
            
            if (power.type === 'mushroom') {
                player.isBig = true;
                player.height = 40;
                score += 1000;
                document.getElementById('mushroomIcon').classList.add('active');
                playSound('powerupSound');
            } else if (power.type === 'flower') {
                player.hasFire = true;
                score += 1000;
                document.getElementById('flowerIcon').classList.add('active');
                playSound('powerupSound');
            } else if (power.type === 'star') {
                player.invincible = true;
                player.invincibilityTimer = 300;
                score += 1000;
                document.getElementById('starIcon').classList.add('active');
                playSound('powerupSound');
            }
            
            powerups.splice(i, 1);
        }
    }
    
    // Coin collection
    for (let i = coinArray.length - 1; i >= 0; i--) {
        let coin = coinArray[i];
        if (!coin.collected &&
            player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y) {
            
            coin.collected = true;
            coins++;
            score += 200;
            playSound('coinSound');
            
            if (coins % 100 === 0) lives++;
            
            coinArray.splice(i, 1);
        }
    }
    
    // Enemy collision
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        
        // Move enemy
        if (enemy.alive) {
            enemy.x += enemy.speed * enemy.direction;
            
            // Enemy AI
            if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
                enemy.direction *= -1;
            }
        }
        
        // Player-enemy collision
        if (enemy.alive &&
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y) {
                // Stomp enemy
                enemy.alive = false;
                player.velocityY = player.jumpPower / 2;
                score += 100;
                playSound('stompSound');
                
                setTimeout(() => {
                    enemies.splice(i, 1);
                }, 200);
            } else {
                // Player hit by enemy
                if (player.invincible) {
                    enemy.alive = false;
                    score += 100;
                } else if (player.isBig) {
                    player.isBig = false;
                    player.height = 30;
                    player.invincible = true;
                    player.invincibilityTimer = 60;
                    document.getElementById('mushroomIcon').classList.remove('active');
                    playSound('damageSound');
                } else {
                    lives--;
                    player.invincible = true;
                    player.invincibilityTimer = 60;
                    playSound('damageSound');
                    
                    if (lives <= 0) {
                        gameOver();
                    }
                }
            }
        }
    }
    
    // Invincibility timer
    if (player.invincible) {
        player.invincibilityTimer--;
        if (player.invincibilityTimer <= 0) {
            player.invincible = false;
            document.getElementById('starIcon').classList.remove('active');
        }
    }
    
    // Level complete (reaching flag)
    if (player.x > 750) {
        completeLevel();
    }
    
    // Fall off screen
    if (player.y > canvas.height) {
        lives--;
        if (lives <= 0) {
            gameOver();
        } else {
            player.x = 100;
            player.y = 330;
            player.velocityX = 0;
            player.velocityY = 0;
        }
    }
    
    // World time
    if (worldTime <= 0) {
        lives--;
        if (lives <= 0) gameOver();
        else worldTime = 400;
    }
    
    updateHUD();
}

function updateCamera() {
    camera.x = player.x - canvas.width / 3;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > 400) camera.x = 400;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sky gradient
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#6ec8ff');
    gradient.addColorStop(1, '#3ca0e8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw clouds
    drawClouds();
    
    // Draw platforms
    for (let platform of platforms) {
        if (platform.type === 'ground') {
            // Ground with grass
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(platform.x - camera.x, platform.y, platform.width, 20);
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(platform.x - camera.x, platform.y - 5, platform.width, 5);
            
            // Ground pattern
            ctx.fillStyle = '#654321';
            for (let i = 0; i < platform.width; i += 20) {
                ctx.fillRect(platform.x - camera.x + i, platform.y + 25, 10, 10);
            }
        } else if (platform.type === 'brick') {
            ctx.fillStyle = '#B22222';
            ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
            
            // Brick pattern
            ctx.fillStyle = '#8B0000';
            for (let i = 0; i < platform.width; i += 10) {
                ctx.fillRect(platform.x - camera.x + i, platform.y, 5, 5);
            }
        } else if (platform.type === 'question') {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
            
            // Question mark
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.fillText('?', platform.x - camera.x + 12, platform.y + 16);
        } else if (platform.type === 'pipe') {
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
            ctx.fillStyle = '#228B22';
            ctx.fillRect(platform.x - camera.x + 5, platform.y - 10, platform.width - 10, 10);
        } else if (platform.type === 'cloud') {
            ctx.fillStyle = '#FFF';
            ctx.fillRect(platform.x - camera.x, platform.y, platform.width, platform.height);
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#FFF';
        }
    }
    
    ctx.shadowBlur = 0;
    
    // Draw coins
    for (let coin of coinArray) {
        if (!coin.collected) {
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FFD700';
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x - camera.x + 7, coin.y + 7, 7, 0, Math.PI * 2);
            ctx.fill();
            
            // Coin shine
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(coin.x - camera.x + 4, coin.y + 4, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Draw powerups
    for (let power of powerups) {
        if (power.type === 'mushroom') {
            ctx.fillStyle = '#B22222';
            ctx.beginPath();
            ctx.arc(power.x - camera.x + 10, power.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Mushroom spots
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(power.x - camera.x + 6, power.y + 6, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(power.x - camera.x + 14, power.y + 6, 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (power.type === 'flower') {
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.arc(power.x - camera.x + 10, power.y + 10, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Flower petals
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(power.x - camera.x + 5, power.y + 2, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(power.x - camera.x + 15, power.y + 2, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (power.type === 'star') {
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFD700';
            ctx.fillStyle = '#FFD700';
            
            // Draw star
            for (let i = 0; i < 5; i++) {
                let angle = (i * 72 - 36) * Math.PI / 180;
                let x = power.x - camera.x + 10 + Math.cos(angle) * 10;
                let y = power.y + 10 + Math.sin(angle) * 10;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.arc(power.x - camera.x + 10, power.y + 10, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Draw enemies
    for (let enemy of enemies) {
        if (enemy.alive) {
            if (enemy.type === 'goomba') {
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.arc(enemy.x - camera.x + 10, enemy.y + 8, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(enemy.x - camera.x + 6, enemy.y + 4, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(enemy.x - camera.x + 14, enemy.y + 4, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Feet
                ctx.fillStyle = '#654321';
                ctx.fillRect(enemy.x - camera.x + 2, enemy.y + 16, 4, 4);
                ctx.fillRect(enemy.x - camera.x + 14, enemy.y + 16, 4, 4);
            } else if (enemy.type === 'koopa') {
                ctx.fillStyle = '#32CD32';
                ctx.fillRect(enemy.x - camera.x, enemy.y, 20, 15);
                
                // Shell pattern
                ctx.fillStyle = '#228B22';
                ctx.fillRect(enemy.x - camera.x + 2, enemy.y + 3, 4, 9);
                ctx.fillRect(enemy.x - camera.x + 14, enemy.y + 3, 4, 9);
                
                // Head
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(enemy.x - camera.x + 4, enemy.y - 5, 12, 8);
            } else if (enemy.type === 'bowser') {
                ctx.fillStyle = '#B22222';
                ctx.fillRect(enemy.x - camera.x, enemy.y, 30, 25);
                
                // Spikes
                ctx.fillStyle = '#FFD700';
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(enemy.x - camera.x + i * 10, enemy.y - 5);
                    ctx.lineTo(enemy.x - camera.x + i * 10 + 5, enemy.y - 10);
                    ctx.lineTo(enemy.x - camera.x + i * 10 + 10, enemy.y - 5);
                    ctx.fill();
                }
                
                // Eyes
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(enemy.x - camera.x + 8, enemy.y + 8, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(enemy.x - camera.x + 22, enemy.y + 8, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // Draw player (Mario)
    ctx.save();
    
    // Player shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(player.x - camera.x - 5, player.y + player.height, player.width + 10, 5);
    
    // Mario's hat
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x - camera.x + 5, player.y - 10, 20, 8);
    ctx.fillRect(player.x - camera.x + 10, player.y - 15, 10, 8);
    
    // Mario's body
    if (player.invincible) {
        ctx.fillStyle = `rgba(255, 255, 0, ${0.5 + Math.sin(Date.now() * 0.02) * 0.3})`;
    } else {
        ctx.fillStyle = '#FF0000';
    }
    ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
    
    // Mario's overalls
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(player.x - camera.x + 5, player.y + 15, 5, 10);
    ctx.fillRect(player.x - camera.x + 20, player.y + 15, 5, 10);
    
    // Mario's mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x - camera.x + 10, player.y + 10, 10, 2);
    
    // Mario's eyes
    ctx.fillStyle = '#FFF';
    ctx.fillRect(player.x - camera.x + 8, player.y + 5, 4, 4);
    ctx.fillRect(player.x - camera.x + 18, player.y + 5, 4, 4);
    
    // Mario's pupils
    ctx.fillStyle = '#000';
    if (player.facingRight) {
        ctx.fillRect(player.x - camera.x + 10, player.y + 6, 2, 2);
        ctx.fillRect(player.x - camera.x + 20, player.y + 6, 2, 2);
    } else {
        ctx.fillRect(player.x - camera.x + 8, player.y + 6, 2, 2);
        ctx.fillRect(player.x - camera.x + 18, player.y + 6, 2, 2);
    }
    
    ctx.restore();
    
    // Draw flagpole (level end)
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(770 - camera.x, 200, 5, 150);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(775 - camera.x, 200, 20, 20);
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    
    for (let i = 0; i < 3; i++) {
        let x = (i * 200 + Date.now() * 0.01) % 900 - 100;
        ctx.beginPath();
        ctx.arc(x - camera.x, 50, 30, 0, Math.PI * 2);
        ctx.arc(x + 40 - camera.x, 50, 25, 0, Math.PI * 2);
        ctx.arc(x + 20 - camera.x, 30, 20, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateHUD() {
    document.getElementById('healthDisplay').textContent = lives;
    document.getElementById('coinDisplay').textContent = coins;
    document.getElementById('scoreDisplay').textContent = score;
}

function updateTimer() {
    if (!gameRunning || gamePaused || levelComplete) return;
    
    worldTime--;
    if (worldTime < 0) worldTime = 0;
}

function completeLevel() {
    levelComplete = true;
    
    let coinBonus = coins * 10;
    let timeBonus = worldTime * 5;
    
    document.getElementById('levelScore').textContent = `Score: ${score + coinBonus + timeBonus}`;
    document.getElementById('levelCoins').textContent = `Coins: ${coins}`;
    
    document.getElementById('levelComplete').classList.remove('hidden');
    
    score += coinBonus + timeBonus;
    updateHUD();
}

function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = `Score: ${score}`;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Audio Functions (silent for now)
function playSound(soundId) {
    // Audio would go here
}

function updateSFXVolume(e) {
    document.getElementById('sfxValue').textContent = e.target.value + '%';
}

function updateMusicVolume(e) {
    document.getElementById('musicValue').textContent = e.target.value + '%';
}
