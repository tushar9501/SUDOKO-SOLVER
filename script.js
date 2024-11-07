document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.sudoku-grid input');

    cells.forEach(cell => {
        cell.addEventListener('keydown', handleKeyDown);
    });

    // Add event listener for theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

function toggleTheme() {
    document.body.classList.toggle('dark');
}

function handleKeyDown(event) {
    const key = event.key;
    const cell = event.target;
    const [row, col] = cell.id.split('-').slice(1).map(Number);

    if (key === 'ArrowRight') {
        moveFocus(row, col, 0, 1);
    } else if (key === 'ArrowLeft') {
        moveFocus(row, col, 0, -1);
    } else if (key === 'ArrowUp') {
        moveFocus(row, col, -1, 0);
    } else if (key === 'ArrowDown') {
        moveFocus(row, col, 1, 0);
    }
}

function moveFocus(row, col, rowDelta, colDelta) {
    const newRow = row + rowDelta;
    const newCol = col + colDelta;
    if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
        document.getElementById(`cell-${newRow}-${newCol}`).focus();
    }
}

function solveSudoku() {
    const board = readBoard();
    const message = document.getElementById("message");
    if (solve(board)) {
        displayBoard(board);
        message.textContent = "Sudoku Solved!";
        message.style.color = "green";
    } else {
        message.textContent = "No solution exists.";
        message.style.color = "red";
    }
}

function readBoard() {
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            row.push(cell.value ? parseInt(cell.value) : 0);
        }
        board.push(row);
    }
    return board;
}

function displayBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            cell.value = board[i][j] !== 0 ? board[i][j] : '';
        }
    }
}

// Sudoku solving logic
function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}

function solve(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solve(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function resetBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            document.getElementById(`cell-${i}-${j}`).value = '';
        }
    }
    document.getElementById("message").textContent = '';
}
