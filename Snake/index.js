const readline = require('readline');
const esc = require('ansi-escapes');

// Constants
const WIDTH = 30;
const HEIGHT = 15;
const SPEED = { max: 500, min: 80, step: 10 };

// Game state variables
let map, snake, snakeHead, foodPos, score, interval, currentSpeed, highScore = 0, isPaused = false;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// handling keypress events
function setupKeyListeners() {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.removeAllListeners('keypress');

    process.stdin.on('keypress', (str, key) => {
        if (key.name == 'z' && key.ctrl) {
            console.log(esc.cursorShow);
            process.exit(0);
        } else if (key.name == "up") {
            if (!snakeHead.movingDown) {
                snakeHead.movingForward = true;
                snakeHead.movingDown = false;
                snakeHead.movingLeft = false;
                snakeHead.movingRight = false;
            }
        } else if (key.name == "down") {
            if (!snakeHead.movingForward) {
                snakeHead.movingForward = false;
                snakeHead.movingDown = true;
                snakeHead.movingLeft = false;
                snakeHead.movingRight = false;
            }
        } else if (key.name == "left") {
            if (!snakeHead.movingRight) {
                snakeHead.movingForward = false;
                snakeHead.movingDown = false;
                snakeHead.movingLeft = true;
                snakeHead.movingRight = false;
            }
        } else if (key.name == "right") {
            if (!snakeHead.movingLeft) {
                snakeHead.movingForward = false;
                snakeHead.movingDown = false;
                snakeHead.movingLeft = false;
                snakeHead.movingRight = true;
            }
        } else if (key.name == "p") {
            togglePause();
        }
    });
}



function newGame() {
    score = 0;
    currentSpeed = SPEED.max;
    isPaused = false;
    // creating a 15 x 30 map
    map = Array.from(Array(HEIGHT), _ => Array(WIDTH).fill(0));
    // setting the snake in the middle
    snakeHead = { x: 12, y: 5, movingForward: true, movingDown: false, movingLeft: false, movingRight: false };
    snake = [
        [12, 5],
        [12, 6]
    ];

    map[5][12] = 1; // head
    map[6][12] = 2; // body

    // setting the food
    foodPos = findValidFoodPosition();
    if (foodPos) {
        map[foodPos.y][foodPos.x] = 5;
    }

    drawMap();
}

function drawMap() {
    // top borders - each cell is 3 chars wide, plus 2 for side borders
    res = "▉" + "▉".repeat(WIDTH * 3) + "▉\n";
    // drawing other parts
    for (let row of map) {
        res += "▉"; // left border
        for (let col of row) {
            if (col == 0) {
                res += "   ";
            } else if (col == 1) {
                res += clr(" ⬤ ", "yellow");
            } else if (col == 2) {
                res += clr(" ⬤ ", "green");
            } else if (col == 5) {
                res += clr(" ❤ ", "red");
            }
        }
        res += "▉\n"; // right border and newline
    }
    // bottom borders
    res += "▉" + "▉".repeat(WIDTH * 3) + "▉";
    print(res + "\n");

    // Enhanced HUD with score, high score, and visual speed bar
    const speedBar = getSpeedBar();
    const hudLine = `Score: ${clr(score, "yellow")} | High Score: ${clr(highScore, "cyan")} | Speed: ${speedBar}`;
    const controlsHint = isPaused
        ? clr("PAUSED", "yellow") + " - Press P to resume"
        : "Press " + clr("P", "cyan") + " to pause";

    print(hudLine, true, false);
    print(controlsHint, true, false);
}

function getSpeedBar() {
    // Calculate speed level based on current speed (1-5 dots)
    const range = SPEED.max - SPEED.min;
    const progress = SPEED.max - currentSpeed;
    const percentage = (progress / range) * 100;

    let level;
    let label;
    if (percentage < 20) {
        level = 1;
        label = "Slow";
    } else if (percentage < 40) {
        level = 2;
        label = "Medium";
    } else if (percentage < 60) {
        level = 3;
        label = "Fast";
    } else if (percentage < 80) {
        level = 4;
        label = "Very Fast";
    } else {
        level = 5;
        label = "Maximum";
    }

    const filled = "●".repeat(level);
    const empty = "○".repeat(5 - level);
    return clr(label + " " + filled + empty, "cyan");
}

function findValidFoodPosition() {
    // Find all empty cells (not occupied by snake)
    let emptyCells = [];
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            // Check if this position is occupied by snake
            const isOccupied = snake.some(([sx, sy]) => sx === x && sy === y);
            if (!isOccupied) {
                emptyCells.push({ x, y });
            }
        }
    }

    if (emptyCells.length === 0) {
        return null; // No empty cells (game won!)
    }

    // Choose random empty cell
    const randomIndex = randInt(0, emptyCells.length - 1);
    return emptyCells[randomIndex];
}

function setFoodPos() {
    foodPos = findValidFoodPosition();
}

function isEatingFood() {
    return snakeHead.x == foodPos.x && snakeHead.y == foodPos.y;
}

function isEatingSelf() {
    return snake.find((val, index) => {
        return index != 0 && val[0] == snakeHead.x && val[1] == snakeHead.y;
    });
}

function loop() {
    if (isPaused) return; // Don't update game when paused

    // clearing all the values in the map (setting them to 0)
    map = Array.from(Array(HEIGHT), _ => Array(WIDTH).fill(0));

    // snake move logic
    if (snakeHead.movingForward) {
        snakeHead.y -= 1;
    } else if (snakeHead.movingDown) {
        snakeHead.y += 1;
    } else if (snakeHead.movingLeft) {
        snakeHead.x -= 1;
    } else if (snakeHead.movingRight) {
        snakeHead.x += 1;
    }

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = snake[i - 1];
    }

    snake[0] = [snakeHead.x, snakeHead.y];

    // wall hit detection
    if (snakeHead.x < 0) {
        gameOver("You hit the wall!");
        clearInterval(interval);
        return;
    } else if (snakeHead.x >= WIDTH) {
        clearInterval(interval);
        gameOver("You hit the wall!");
        return;
    } else if (snakeHead.y < 0) {
        clearInterval(interval);
        gameOver("You hit the wall!");
        return;
    } else if (snakeHead.y >= HEIGHT) {
        clearInterval(interval);
        gameOver("You hit the wall!");
        return;
    }

    for (let [x, y] of snake) {
        if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
            map[y][x] = 1;
        }
    }


    if (isEatingFood()) {
        snake.push([-1, -1]);
        setFoodPos();
        if (foodPos) {
            map[foodPos.y][foodPos.x] = 5;
        }
        score++;
        highScore = Math.max(highScore, score);
    }

    map[snakeHead.y][snakeHead.x] = 2;
    if (foodPos) {
        map[foodPos.y][foodPos.x] = 5;
    }

    drawMap();

    if (isEatingSelf()) {
        clearInterval(interval);
        gameOver("You ate yourself");
        return;
    }

    // Progressive speed system - only update interval when speed changes
    const newSpeed = computeSpeed(score);
    if (newSpeed !== currentSpeed) {
        currentSpeed = newSpeed;
        clearInterval(interval);
        interval = setInterval(loop, currentSpeed);
    }
}

function computeSpeed(points) {
    let speed = SPEED.max - points * SPEED.step;
    if (speed < SPEED.min) {
        speed = SPEED.min;
    }
    return speed;
}

function main() {
    clearInterval(interval);
    newGame();
    drawMap();
    setupKeyListeners();
    currentSpeed = SPEED.max;
    interval = setInterval(loop, currentSpeed);
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(interval);
    } else {
        interval = setInterval(loop, currentSpeed);
    }
    drawMap();
}

function gameOver(msg) {
    clearInterval(interval);
    const speedBar = getSpeedBar();

    // Create borders matching game board width
    const boxWidth = (WIDTH * 3);
    const topBorder = "╔" + "═".repeat(boxWidth) + "╗";
    const bottomBorder = "╚" + "═".repeat(boxWidth) + "╝";

    const createLine = (text) => {
        const padding = Math.floor((boxWidth - text.length) / 2);
        const leftPad = " ".repeat(padding);
        const rightPad = " ".repeat(boxWidth - text.length - padding);
        return "║" + leftPad + text + rightPad + "║";
    };

    print(clr(topBorder, "red"), false, false);
    print(clr(createLine("GAME OVER!"), "red"), false, false);
    print(clr(bottomBorder, "red"), false, false);
    print("", false, false);
    print(clr("Reason: ", "yellow") + msg, false, false);
    print("", false, false);
    print(clr("Final Score: ", "yellow") + clr(score, "cyan"), false, false);
    print(clr("High Score: ", "yellow") + clr(highScore, "cyan"), false, false);
    print(clr("Final Speed: ", "yellow") + speedBar, false, false);
    print("", false, false);
    print(clr("Options:", "yellow"), false, false);
    print("  " + clr("R", "green") + " - Restart game", false, false);
    print("  " + clr("M", "green") + " - Return to main menu", false, false);
    print("  " + clr("Q", "green") + " - Quit", false, false);

    process.stdin.removeAllListeners('keypress');
    process.stdin.setRawMode(true);

    function handleRestartKeypress(str, key) {
        if (key.name === 'r') {
            print(clr("Restarting game...", "green"), false, false);
            process.stdin.removeListener('keypress', handleRestartKeypress);
            main();
        } else if (key.name === 'm') {
            print(clr("Returning to main menu...", "green"), false, false);
            process.stdin.removeListener('keypress', handleRestartKeypress);
            showMainMenu();
        } else if (key.name === 'q') {
            console.log("\nQuitting game.");
            console.log(esc.cursorShow);
            process.exit();
        }
    }
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', handleRestartKeypress);
}

function showMainMenu() {
    clearInterval(interval);
    process.stdin.removeAllListeners('keypress');

    // Calculate menu width to match game board
    const menuWidth = (WIDTH * 3);

    const topBorder = "╔" + "═".repeat(menuWidth) + "╗";
    const bottomBorder = "╚" + "═".repeat(menuWidth) + "╝";
    const emptyLine = "║" + " ".repeat(menuWidth) + "║";

    const createLine = (text) => {
        const padding = Math.floor((menuWidth - text.length) / 2);
        const leftPad = " ".repeat(padding);
        const rightPad = " ".repeat(menuWidth - text.length - padding);
        return "║" + leftPad + text + rightPad + "║";
    };

    print(clr("\n" + topBorder, "cyan"), false, true);
    print(clr(emptyLine, "cyan"), false, false);
    print(clr(createLine("🐍 SNAKE GAME MENU 🐍"), "cyan"), false, false);
    print(clr(emptyLine, "cyan"), false, false);
    print(clr(bottomBorder, "cyan"), false, false);
    print("\n" + clr("How to Play:", "yellow"), false, false);
    print("  • Use " + clr("Arrow Keys", "green") + " to control the snake", false, false);
    print("  • Eat " + clr("❤", "red") + " to grow and increase your score", false, false);
    print("  • Speed increases progressively as you score more!", false, false);
    print("  • Avoid hitting walls and yourself", false, false);
    print("\n" + clr("Controls:", "yellow"), false, false);
    print("  • " + clr("↑ ↓ ← →", "green") + " - Move snake", false, false);
    print("  • " + clr("Ctrl+Z", "green") + " - Quit anytime", false, false);
    print("\n" + clr("Options:", "yellow"), false, false);
    print("  " + clr("S", "green") + " - Start Game", false, false);
    print("  " + clr("Q", "green") + " - Quit", false, false);
    print("", false, false);

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    function handleMenuKeypress(str, key) {
        if (key.name === 's') {
            process.stdin.removeListener('keypress', handleMenuKeypress);
            print(clr("\nStarting game...", "green"), false, false);
            setTimeout(() => main(), 500);
        } else if (key.name === 'q' || (key.name === 'z' && key.ctrl)) {
            console.log("\nThanks for playing!");
            console.log(esc.cursorShow);
            process.exit();
        }
    }

    process.stdin.on('keypress', handleMenuKeypress);
}

function print(str, hide = true, clear = true) {
    if (clear) {
        console.log(esc.clearTerminal);
    }
    console.log(str);
    console.log(hide ? esc.cursorHide : esc.cursorShow);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clr(text, color) {
    const code = { red: 91, green: 92, blue: 34, cyan: 96, yellow: 93 }[color];
    if (code) return "\x1b[" + code + "m" + text + "\x1b[0m";
    return text;
}

// Start with main menu
showMainMenu();
