class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();

        // Game settings
        this.cellSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.powerUp = null;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameOver = false;
        this.powerUpTimeout = null;
        this.speedLevels = {
            beginner: 150,
            medium: 100,
            hard: 70
        };
        this.currentSpeed = this.speedLevels.beginner;
        this.currentTheme = 'modern';
        this.themes = {
            modern: {
                background: getComputedStyle(document.documentElement).getPropertyValue('--snake-modern-bg'),
                snakeHead: getComputedStyle(document.documentElement).getPropertyValue('--snake-modern-head'),
                snakeBody: getComputedStyle(document.documentElement).getPropertyValue('--snake-modern-body'),
                food: getComputedStyle(document.documentElement).getPropertyValue('--snake-modern-food'),
                powerUp: getComputedStyle(document.documentElement).getPropertyValue('--snake-modern-powerup')
            },
            nokia: {
                background: getComputedStyle(document.documentElement).getPropertyValue('--snake-nokia-bg'),
                snakeHead: getComputedStyle(document.documentElement).getPropertyValue('--snake-nokia-head'),
                snakeBody: getComputedStyle(document.documentElement).getPropertyValue('--snake-nokia-body'),
                food: getComputedStyle(document.documentElement).getPropertyValue('--snake-nokia-food'),
                powerUp: getComputedStyle(document.documentElement).getPropertyValue('--snake-nokia-powerup')
            },
            matrix: {
                background: getComputedStyle(document.documentElement).getPropertyValue('--snake-matrix-bg'),
                snakeHead: getComputedStyle(document.documentElement).getPropertyValue('--snake-matrix-head'),
                snakeBody: getComputedStyle(document.documentElement).getPropertyValue('--snake-matrix-body'),
                food: getComputedStyle(document.documentElement).getPropertyValue('--snake-matrix-food'),
                powerUp: getComputedStyle(document.documentElement).getPropertyValue('--snake-matrix-powerup')
            }
        };

        // Initialize event listeners
        this.initializeEventListeners();

        // Start game loop
        this.gameLoop();
    }

    setupCanvas() {
        // Make canvas responsive
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.ctx.scale(1, 1);
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('speedLevel').addEventListener('change', (e) => {
            this.currentSpeed = this.speedLevels[e.target.value];
        });
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.currentTheme = e.target.value;
        });
    }

    handleKeyPress(e) {
        const key = e.key.toLowerCase();

        // Game over controls
        if (this.gameOver) {
            if (key === 'q') {
                // Hide game over screen and show a quit message
                document.getElementById('gameOverScreen').innerHTML = '<h2>Thanks for playing!</h2>';
                return;
            } else if (key === 'c') {
                this.restart();
                return;
            }
            return;
        }

        // Regular game controls
        const directions = {
            'arrowup': 'up',
            'arrowdown': 'down',
            'arrowleft': 'left',
            'arrowright': 'right'
        };

        if (directions[key]) {
            e.preventDefault();
            const newDirection = directions[key];
            const opposites = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };

            if (this.direction !== opposites[newDirection]) {
                this.direction = newDirection;
            }
        }
    }

    generateFood() {
        let x, y;
        do {
            x = Math.floor(Math.random() * (this.canvas.width / this.cellSize));
            y = Math.floor(Math.random() * (this.canvas.height / this.cellSize));
        } while (this.snake.some(segment => segment.x === x && segment.y === y));

        return {x, y, type: 'regular'};
    }

    generatePowerUp() {
        if (this.powerUp) return;

        let x, y;
        do {
            x = Math.floor(Math.random() * (this.canvas.width / this.cellSize));
            y = Math.floor(Math.random() * (this.canvas.height / this.cellSize));
        } while (this.snake.some(segment => segment.x === x && segment.y === y));

        this.powerUp = {x, y, type: 'power'};

        // Power-up disappears after 5 seconds
        this.powerUpTimeout = setTimeout(() => {
            this.powerUp = null;
        }, 5000);
    }

    moveSnake() {
        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.cellSize ||
            head.y < 0 || head.y >= this.canvas.height / this.cellSize) {
            this.gameOver = true;
            return;
        }

        // Check collision with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);

        // Check for food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            if (Math.random() < 0.2) { // 20% chance to spawn power-up
                this.generatePowerUp();
            }
        } else if (this.powerUp && head.x === this.powerUp.x && head.y === this.powerUp.y) {
            this.score += 50;
            // Grow snake by 2 additional segments
            this.snake.push({...this.snake[this.snake.length - 1]});
            this.snake.push({...this.snake[this.snake.length - 1]});
            this.powerUp = null;
            clearTimeout(this.powerUpTimeout);
        } else {
            this.snake.pop();
        }

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            document.getElementById('highScore').textContent = this.highScore;
        }

        document.getElementById('score').textContent = this.score;
    }

    draw() {
        const theme = this.themes[this.currentTheme];

        // Clear canvas
        this.ctx.fillStyle = theme.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? theme.snakeHead : theme.snakeBody;
            this.ctx.fillRect(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = theme.food;
        this.ctx.fillRect(
            this.food.x * this.cellSize,
            this.food.y * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
        );

        // Draw power-up if active
        if (this.powerUp) {
            this.ctx.fillStyle = theme.powerUp;
            this.ctx.fillRect(
                this.powerUp.x * this.cellSize,
                this.powerUp.y * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
            );
        }
    }

    gameLoop() {
        if (!this.gameOver) {
            this.moveSnake();
            this.draw();

            // Update game over screen
            document.getElementById('gameOverScreen').classList.add('d-none');
            setTimeout(() => this.gameLoop(), this.currentSpeed);
        } else {
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('gameOverScreen').classList.remove('d-none');
        }
    }

    restart() {
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.powerUp = null;
        this.score = 0;
        this.gameOver = false;
        clearTimeout(this.powerUpTimeout);
        document.getElementById('score').textContent = '0';
        this.gameLoop();
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new SnakeGame();
});