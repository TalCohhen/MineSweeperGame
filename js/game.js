'use strict'

const MINE = '💣';
const FLAG = '🚩';


var gBoard;
var gLevel;
var gStartTime;
var gWatchInterval;
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
    showMinesCounter()
}


function chooseLevel(boardSize) {
    restartGame();
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
    showMinesCounter()
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
    // board[0][2].isShown = true;
    board[1][1].isMine = true;
    setMinesNegsCount(board);
    return board;
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];

            if (currCell.isShown) {
                if (currCell.isMine) {
                    strHTML += `<td style="background-color: red; border: 1px solid grey;">${MINE}</td>\n`
                } else if (currCell.minesAroundCount > 0) {
                    strHTML += `<td style="background-color: lightgrey; border: 1px solid bgrey;"><b>${currCell.minesAroundCount}</b></td>\n`
                } else {
                    strHTML += `<td style="background-color: lightgrey; border: 1px solid grey;">${''}</td>\n`
                }
            } else if (currCell.isMarked) {
                strHTML += `<td >${FLAG}</td>\n`
            } else {
                strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})">${''} </td>\n`;
            }
        }
        strHTML += '</tr>\n';

        var elBoard = document.querySelector('.board');
        elBoard.innerHTML = strHTML;
    }
}

//puts into evry cell its around mine count
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            // var currCell = board[i][j];
            board[i][j].minesAroundCount = countNeighbors(i, j, board);
            console.log('minesAroundCount', board[i][j].minesAroundCount);
        }
    }
}

//counting nbr cells that have mine
function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

// onmousedown="WhichButton(event) to see which button
function cellClicked(elCell, i, j) {
    if (gGame.shownCount === 0) {
        gGame.isOn = true
        startStopWatch();
        //TODO randomMinesPos()
    }

    var currCell = gBoard[i][j]
    currCell.isShown = true;
    // elCell.classList.add('shown');

    if (currCell.isMine) {
        gGame.isOn = false;
        endStopWatch()
        var elbtn = document.querySelector('.restart');
        elbtn.innerText = '😖';
    }
    if (currCell.minesAroundCount === 0) expandShown(gBoard, i, j);
    else gGame.shownCount++;

    // console.log(gBoard[i][j]);
    // console.log(elCell);
    console.log('gGame.shownCount', gGame.shownCount);
    renderBoard();
    checkGameOver()
}

function cellMarked(elCell, i, j) {

    var currCell = gBoard[i][j];
    if (currCell.isMarked) {
        elCell.innerText = '';
        currCell.isMarked = false;
        gGame.markedCount--
        showMinesCounter()
    } else {
        elCell.innerText = FLAG;
        currCell.isMarked = true;
        gGame.markedCount++
        showMinesCounter()
    }
}

function checkGameOver() {
    if ((gLevel.SIZE - gLevel.MINES) === gGame.shownCount &&
        (gLevel.SIZE - gGame.markedCount) === gGame.shownCount) {
        endStopWatch()
        var elbtn = document.querySelector('.restart');
        elbtn.innerText = '😎';
    }

}


function showMinesCounter() {
    var minesBalance = gLevel.MINES - gGame.markedCount;
    var elMarked = document.querySelector('.mines-counter');
    elMarked.innerText = minesBalance;
    if (minesBalance < 10) {
        elMarked.innerText = `00${minesBalance}`
    } else if (minesBalance < 100) {
        elMarked.innerText = `0${minesBalance}`
    } else
        elMarked.innerText = minesBalance;
}

randomMinesPos()



function expandShown(board, i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x >= board.length) continue;
        for (var y = j - 1; y <= j + 1; y++) {
            if (y < 0 || y >= board[i].length) continue;
            if (!board[x][y].isMarked && !board[x][y].isShown) {
                board[x][y].isShown = true;
                gGame.shownCount++;
            }
            // console.log(board[x][y]);
        }
    }

}

function restartGame() {
    endStopWatch();
    var elbtn = document.querySelector('.restart');
    elbtn.innerText = '😀';
    var elTime = document.querySelector('.time');
    elTime.innerText = `000`
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    initGame();

}

function randomMinesPos() {

}




function startStopWatch() {
    gWatchInterval = setInterval(updateWatch, 1);
    gStartTime = Date.now();
}

function updateWatch() {
    if (gGame.isOn) {
        var now = Date.now();
        gGame.secsPassed = ((now - gStartTime) / 1000).toFixed(0);
        var elTime = document.querySelector('.time');
        if (gGame.secsPassed < 10) {
            elTime.innerText = `00${gGame.secsPassed}`
        } else if (gGame.secsPassed < 100) {
            elTime.innerText = `0${gGame.secsPassed}`
        } else
            elTime.innerText = gGame.secsPassed;
    }
}

function endStopWatch() {
    clearInterval(gWatchInterval);
    gWatchInterval = null;

}