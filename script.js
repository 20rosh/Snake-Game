let playerName;
let score = 0;
let speed = 150;  // Default speed
let snakeColor = "#00FF00";  // Default snake color
let countdownValue = 3;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
let interval;

// DOM elements
const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");
const scoreDisplay = document.getElementById("scoreDisplay");
const countdownElement = document.getElementById("countdown");
const playAgainButton = document.getElementById("playAgainButton");
const homeButton = document.getElementById("homeButton");
const speedSelect = document.getElementById("speed");
const snakeColorInput = document.getElementById("snakeColor");

// Start game button
document.getElementById("startButton").addEventListener("click", function() {
    playerName = document.getElementById("playerName").value;
    if (!playerName) {
        alert("Please enter your name.");
        return;
    }

    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block";
    
    startCountdown();
});

// Countdown before the game starts
function startCountdown() {
    countdownValue = 3;
    countdownElement.style.display = "block";
    const countdownInterval = setInterval(function() {
        countdownElement.textContent = countdownValue;
        countdownValue--;
        if (countdownValue < 0) {
            clearInterval(countdownInterval);
            countdownElement.style.display = "none";
            startGame();
        }
    }, 1000);
}

// Start the game
function startGame() {
    score = 0;
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    updateScore();
    interval = setInterval(gameLoop, speed);
}

// Game loop
function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
    } else {
        drawGame();
    }
}

// Move snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    } else {
        snake.pop();
    }
}

// Draw game elements
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = snakeColor;
    snake.forEach(function(part) {
        ctx.fillRect(part.x, part.y, 20, 20);
    });

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// Check collision with walls or self
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Game over
function gameOver() {
    clearInterval(interval);
    alert(playerName + ", you lost! Your score: " + score);
    playAgainButton.style.display = "block";
    homeButton.style.display = "block";
}

// Update score
function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
}

// Restart game
playAgainButton.addEventListener("click", function() {
    playAgainButton.style.display = "none";
    homeButton.style.display = "none";
    startCountdown();
});

// Go back to home
homeButton.addEventListener("click", function() {
    playAgainButton.style.display = "none";
    homeButton.style.display = "none";
    gameScreen.style.display = "none";
    welcomeScreen.style.display = "block";
});

// Key events to control snake
document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -20 };
    if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 20 };
    if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -20, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 20, y: 0 };
});

// Save settings button
document.getElementById("saveSettings").addEventListener("click", function() {
    speed = parseInt(speedSelect.value);
    snakeColor = snakeColorInput.value;
    alert("Settings saved!");
    document.getElementById("settings").style.display = "none";
    welcomeScreen.style.display = "block";
});

// Go back to the main menu from settings or how to play
document.querySelectorAll("#backToMenu").forEach(function(button) {
    button.addEventListener("click", function() {
        document.getElementById("settings").style.display = "none";
        document.getElementById("howToPlay").style.display = "none";
        welcomeScreen.style.display = "block";
    });
});