const boardSize = 5;
const mineCount = 5;
let board = [];
let gameOver = false;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

function createBoard() {
  board = [];
  boardEl.innerHTML = '';
  gameOver = false;
  statusEl.textContent = '';

  for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
      const cell = {
        mine: false,
        revealed: false,
        element: document.createElement('div'),
        row, col
      };

      cell.element.className = 'cell';
      cell.element.addEventListener('click', () => revealCell(cell));

      board[row][col] = cell;
      boardEl.appendChild(cell.element);
    }
  }

  placeMines();
  updateNumbers();
}

function placeMines() {
  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * boardSize);
    const c = Math.floor(Math.random() * boardSize);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
}

function countAdjacentMines(r, c) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nr = r + i, nc = c + j;
      if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
        if (board[nr][nc].mine) count++;
      }
    }
  }
  return count;
}

function updateNumbers() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = board[row][col];
      cell.adjacentMines = countAdjacentMines(row, col);
    }
  }
}

function revealCell(cell) {
  if (cell.revealed || gameOver) return;

  cell.revealed = true;
  cell.element.classList.add('revealed');

  if (cell.mine) {
    cell.element.textContent = '💣';
    statusEl.textContent = 'Game Over!';
    gameOver = true;
    revealAll();
  } else {
    const count = cell.adjacentMines;
    if (count > 0) {
      cell.element.textContent = count;
    } else {
      revealEmptyNeighbors(cell);
    }
  }
}

function revealEmptyNeighbors(cell) {
  const { row, col } = cell;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nr = row + i, nc = col + j;
      if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
        const neighbor = board[nr][nc];
        if (!neighbor.revealed && !neighbor.mine) {
          revealCell(neighbor);
        }
      }
    }
  }
}

function revealAll() {
  board.flat().forEach(cell => {
    if (!cell.revealed) {
      if (cell.mine) {
        cell.element.textContent = '💣';
      } else if (cell.adjacentMines > 0) {
        cell.element.textContent = cell.adjacentMines;
      }
      cell.element.classList.add('revealed');
    }
  });
}

createBoard();
