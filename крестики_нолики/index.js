const cells = document.querySelectorAll('.cell')
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

if (localStorage.getItem('board')) {
    board = JSON.parse(localStorage.getItem('board'))
    cells.forEach((el, index) => el.textContent = board[index])
    const xs = board.filter(el => el === 'X').length;
    const os = board.filter(el => el === 'O').length;

    if (xs > os) {
        currentPlayer = 'O'
        document.body.classList.remove('x-to-move')
        document.body.classList.add('o-to-move')
        message.textContent = `Ход игрока ${currentPlayer}`;
    }
}
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            message.textContent = `Игрок ${currentPlayer} выиграл!`;
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
            return true
        }
    }


    if (!board.includes('') && gameActive) {
        gameActive = false;
        message.textContent = 'Ничья!';
        document.body.classList.remove('x-to-move')
        document.body.classList.remove('o-to-move')
        document.body.classList.add('both')

        return true
    }
    return false
}

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.id);

    if (board[cellIndex] === '' && gameActive) {
        cell.textContent = currentPlayer;
        board[cellIndex] = currentPlayer;
        if (!checkWinner()) {
        
            document.body.classList.toggle('x-to-move')
            document.body.classList.toggle('o-to-move')

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `Ход игрока ${currentPlayer}`;
            localStorage.setItem('board', JSON.stringify(board));
        } else {
            localStorage.removeItem('board');
        }
    }
}

function handleRestart() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = 'Ход игрока X';
    document.body.classList.remove('both')
    document.body.classList.add('x-to-move')
    document.body.classList.remove('o-to-move')
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });
    localStorage.removeItem('board');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestart);
