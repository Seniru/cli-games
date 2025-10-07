const blessed = require('blessed');

const screen = blessed.screen({
  smartCSR: true,
  title: 'Tetris Terminal',
});

const box = blessed.box({
  top: 1,
  left: 1,
  width: 22,
  height: 22,
  border: { type: 'line' },
  style: { fg: 'white', border: { fg: '#00ff00' } },
});

const scoreBox = blessed.box({
  top: 23,
  left: 0,
  width: 24,
  height: 1,
  align: 'center',
  style: { fg: 'yellow' },
});

const timeBox = blessed.box({
  top: 0,
  left: 0,
  width: 24,
  height: 1,
  align: 'center',
  style: { fg: 'magenta' },
});

const controlsBox = blessed.box({
  top: 24,
  left: 0,
  width: 24,
  height: 1,
  align: 'center',
  style: { fg: 'cyan' },
});

const nextBox = blessed.box({
  top: 3,
  left: 25,
  width: 10,
  height: 5,
  border: { type: 'line' },
  label: 'Next',
  style: { fg: 'white', border: { fg: '#00ffff' } },
});

screen.append(box);
screen.append(scoreBox);
screen.append(timeBox);
screen.append(controlsBox);
screen.append(nextBox);

screen.render();

screen.key(['q', 'C-c'], () => process.exit(0));

const shapes = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];

let board, score, isPaused, current, next, game, isGameOver;
let startTime, timerInterval;

function initGame() {
  board = Array.from({ length: 20 }, () => Array(10).fill(0));
  score = 0;
  isPaused = false;
  isGameOver = false;

  next = shapes[Math.floor(Math.random() * shapes.length)];
  current = {
    shape: next,
    x: 3,
    y: 0,
  };
  next = shapes[Math.floor(Math.random() * shapes.length)];

  startTime = Date.now();

  if (game) clearInterval(game);
  game = setInterval(moveDown, 500);

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!isPaused && !isGameOver) {
      const elapsedMs = Date.now() - startTime;
      const minutes = Math.floor(elapsedMs / 60000);
      const seconds = Math.floor((elapsedMs % 60000) / 1000);
      const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      timeBox.setContent(`Time: ${timeStr}`);
      screen.render();
    }
  }, 1000);

  draw();
}

function clearLines() {
  const fullRows = board
    .map((row, i) => (row.every(cell => cell !== 0) ? i : -1))
    .filter(i => i !== -1);

  if (fullRows.length === 0) return;

  for (const i of fullRows) {
    board[i] = Array(10).fill(2); // ligne à clignoter
  }
  draw();

  setTimeout(() => {
    score += fullRows.length * 100;

    board = board.filter((_, i) => !fullRows.includes(i));
    while (board.length < 20) {
      board.unshift(Array(10).fill(0));
    }

    draw();
  }, 100);
}

function mergePiece() {
  const { shape, x, y } = current;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j]) {
        board[y + i][x + j] = 1;
      }
    }
  }
}

function collides() {
  const { shape, x, y } = current;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (
        shape[i][j] &&
        (board[y + i] === undefined ||
          board[y + i][x + j] === undefined ||
          board[y + i][x + j])
      ) {
        return true;
      }
    }
  }
  return false;
}

function rotate(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}

function drawNext() {
  let output = '';
  for (let i = 0; i < next.length; i++) {
    for (let j = 0; j < next[i].length; j++) {
      output += next[i][j] ? '██' : '  ';
    }
    output += '\n';
  }
  nextBox.setContent(output);
}

function draw() {
  if (isGameOver) {
    box.setContent(`Game Over!\nScore: ${score}\nPress R to Restart`);
    scoreBox.setContent('');
    timeBox.setContent('');
    nextBox.setContent('');
    controlsBox.setContent('Q = Quit | R = Restart');
    screen.render();
    return;
  }

  let tempBoard = board.map(row => [...row]);
  const { shape, x, y } = current;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] && tempBoard[y + i]) {
        tempBoard[y + i][x + j] = 1;
      }
    }
  }

  let output = tempBoard
    .map(row =>
      row
        .map(cell => {
          if (cell === 1) return '██';
          if (cell === 2) return '░░';
          return '  ';
        })
        .join('')
    )
    .join('\n');

  box.setContent(output);
  scoreBox.setContent(`Score: ${score}${isPaused ? ' (PAUSED)' : ''}`);
  controlsBox.setContent('P = Pause | Q = Quit');
  drawNext();
  screen.render();
}

function moveDown() {
  if (isPaused || isGameOver) return;

  current.y++;
  if (collides()) {
    current.y--;
    mergePiece();
    clearLines();
    current.shape = next;
    current.x = 3;
    current.y = 0;
    next = shapes[Math.floor(Math.random() * shapes.length)];
    if (collides()) {
      isGameOver = true;
      clearInterval(game);
      clearInterval(timerInterval);
      draw();
      return;
    }
  }
  draw();
}

screen.key(['up'], () => {
  if (isPaused || isGameOver) return;
  const original = current.shape;
  const rotated = rotate(current.shape);
  current.shape = rotated;
  if (collides()) {
    current.shape = original;
  }
  draw();
});

screen.key(['left'], () => {
  if (isPaused || isGameOver) return;
  current.x--;
  if (collides()) current.x++;
  draw();
});

screen.key(['right'], () => {
  if (isPaused || isGameOver) return;
  current.x++;
  if (collides()) current.x--;
  draw();
});

screen.key(['down'], () => {
  if (isPaused || isGameOver) return;
  moveDown();
});

screen.key(['p'], () => {
  if (isGameOver) return;
  isPaused = !isPaused;
  draw();
});

screen.key(['r'], () => {
  if (isGameOver) {
    initGame();
  }
});

initGame();
