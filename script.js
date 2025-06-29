const board = document.querySelector('#board');
const statusDiv = document.querySelector('#status');
const restartBtn = document.querySelector('#restart');
const modeBtn = document.querySelector('#mode-select');

let cells = [];
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let vsAI = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function initBoard() {
    board.innerHTML = '';
    cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
    }
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (gameState[index] === '' && gameActive) {
        makeMove(index, currentPlayer);
        if (vsAI && gameActive && currentPlayer === 'O') {
            setTimeout(aiMove, 600);
        }
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    checkWinner();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            statusDiv.textContent = `Player ${gameState[a]} wins!`;
            gameActive = false;
            highlightWinningCells(combo);
            return;
        }
    }
    if (!gameState.includes('')) {
        statusDiv.textContent = "It's a Draw!";
        gameActive = false;
    }
}

function highlightWinningCells(combo) {
    for (let index of combo) {
        cells[index].style.backgroundColor = '#2ecc71';
        cells[index].style.transform = 'scale(1.1)';
    }
}

function aiMove() {
    const emptyCells = gameState
        .map((val, idx) => val === '' ? idx : null)
        .filter(val => val !== null);
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex, 'O');
    }
}

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    initBoard();
}

function toggleMode() {
    vsAI = !vsAI;
    modeBtn.textContent = vsAI ? 'Play vs Human' : 'Play vs AI';
    restartGame();
}

restartBtn.addEventListener('click', restartGame);
modeBtn.addEventListener('click', toggleMode);

initBoard();