'use strict'

const MINE = '💣';
const FLAG = '🚩';

var cell = {
    minesAroundCount: 0,
    isShown: true,
    isMine: false,
    isMarked: true
};

var gBoard;
var gLevel;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};


function initGame() {
    gLevel = {
        SIZE: 16,
        MINES: 2
    };
    gBoard = buildBoard();
    console.table(gBoard);
    renderBoard();
}

function chooseLevel(boardSize) {
    gLevel.SIZE = boardSize;
    switch (gLevel.SIZE) {
        case 16:
            gLevel.MINES = 2;
            break;
        case 64:
            gLevel.MINES = 12;
            break;
        case 144:
            gLevel.MINES = 30;
            break;
    }
    gBoard = buildBoard();
    renderBoard();
}


function buildBoard() {
    var boardLength = Math.sqrt(gLevel.SIZE)
    var board = [];
    for (var i = 0; i < boardLength; i++) {
        board.push([]);
        for (var j = 0; j < boardLength; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
        };

    }
    board[0][2].isMine = true;
    board[2][1].isMine = true;

    return board;
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];

            // if (currCell.isMine)

            strHTML += `<td onclick="cellClicked(this, ${i}, ${j})">${''}</td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

// function setMinesNegsCount(board)

// function renderBoard(board)

function cellClicked(elCell, i, j) {
    // var cellPos = gBoard[i][j];
    console.log('clicked....');
    console.log(gBoard[i][j]);
    console.log(elCell);


}

// function cellMarked(elCell)

// function checkGameOver()

// function expandShown(board, elCell, i, j) {}