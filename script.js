let playerName;
let score = 0;

// Retrieve the high score and player name from localStorage or initialize them
let highScoreData = JSON.parse(localStorage.getItem("highScoreData")) || { name: "No Player", score: 0 };

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
let interval;

// DOM elements
const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");
const howToPlayScreen = document.getElementById("howToPlay");
const settingsScreen = document.getElementById("settings");
const scoreDisplay = document.getElementById("scoreDisplay");
const countdownElement = document.getElementById("countdown");
const playAgainButton = document.getElementById("playAgainButton");
const homeButton = document.getElementById("homeButton");
const highScoreDisplay = document.getElementById("highScoreDisplay");

// Display high score and player name on welcome screen
highScoreDisplay.textContent = `High Score: ${highScoreData.score} by ${highScoreData.name}`;

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

// Countdown before game starts
function startCountdown() {
    let countdownValue = 3;
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

// Game start function
function startGame() {
    score = 0;
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    updateScore();
    interval = setInterval(gameLoop, 150);
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

// Move snake function
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

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
    ctx.fillStyle = "#00FF00";
    snake.forEach(function(part) {
        ctx.fillRect(part.x, part.y, 20, 20);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// Collision check function
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

// Game over function
function gameOver() {
    clearInterval(interval);
    if (score > highScoreData.score) {
        highScoreData = { name: playerName, score: score };
        localStorage.setItem("highScoreData", JSON.stringify(highScoreData));
        alert(`${playerName}, you set a new high score! Your score: ${score}`);
    } else {
        alert(`${playerName}, you lost! Your score: ${score}`);
    }
    playAgainButton.style.display = "block";
    homeButton.style.display = "block";
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
}

// Restart game
playAgainButton.addEventListener("click", function() {
    playAgainButton.style.display = "none";
    homeButton.style.display = "none";
    startCountdown();
});

// Return to home
homeButton.addEventListener("click", function() {
    playAgainButton.style.display = "none";
    homeButton.style.display = "none";
    gameScreen.style.display = "none";
    welcomeScreen.style.display = "block";
    // Update high score display in case it's changed
    highScoreDisplay.textContent = `High Score: ${highScoreData.score} by ${highScoreData.name}`;
});

// Arrow keys to control snake
document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -20 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 20 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -20, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 20, y: 0 };
            break;
    }
});
