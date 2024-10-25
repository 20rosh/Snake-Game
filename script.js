let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let boxSize = 20; // Increase the size of each box to 20 pixels
let snake = [{ x: 20, y: 20 }];
let direction = 'RIGHT';
let food = {};
let score = 0;
let highScore = 0;
let speed = 100;
let gameInterval;

document.getElementById('welcomeScreen').style.display = 'block';
document.getElementById('highScoreDisplay').innerText = 'High Score: ' + (localStorage.getItem('highScore') || 0);

document.getElementById('startGameButton').onclick = startGame;
document.getElementById('howToPlayButton').onclick = showHowToPlay;
document.getElementById('settingsButton').onclick = showSettings;
document.getElementById('backToHomeButton').onclick = showHome;
document.getElementById('backToHomeFromSettingsButton').onclick = showHome;
document.getElementById('saveSettingsButton').onclick = saveSettings;
document.getElementById('playAgainButton').onclick = startGame;
document.getElementById('homeButton').onclick = showHome;

function startGame() {
    let playerName = document.getElementById('playerName').value;
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('score').innerText = score;
    snake = [{ x: 20, y: 20 }];
    direction = 'RIGHT';
    score = 0;
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
    document.addEventListener('keydown', changeDirection);
}

function gameLoop() {
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScoreDisplay').innerText = 'High Score: ' + highScore;
        }
        document.getElementById('playAgainButton').style.display = 'inline-block';
        document.getElementById('homeButton').style.display = 'inline-block';
        document.removeEventListener('keydown', changeDirection);
        return;
    }
    moveSnake();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    document.getElementById('score').innerText = score;
}

function moveSnake() {
    let head = { ...snake[0] };
    if (direction === 'UP') head.y -= boxSize;
    else if (direction === 'DOWN') head.y += boxSize;
    else if (direction === 'LEFT') head.x -= boxSize;
    else if (direction === 'RIGHT') head.x += boxSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
        if (score % 10 === 0) alert('Great job! You have made ' + score + ' moves!');
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
    };
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood(); // Regenerate food if it overlaps with the snake
        }
    }
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

function checkCollision() {
    let head = snake[0];
    return (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

// Function to change direction based on key press
function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (key === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (key === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (key === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function showHowToPlay() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('howToPlay').style.display = 'block';
}

function showSettings() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('settings').style.display = 'block';
}

function showHome() {
    document.getElementById('howToPlay').style.display = 'none';
    document.getElementById('settings').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'block';
}

function saveSettings() {
    speed = parseInt(document.getElementById('speed').value);
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}
