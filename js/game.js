'use strict'

const MINE = '💣';
const FLAG = '🚩';
const SMILEI = '😀'
const WIN = '🥳';
const LOSE = '😫';

var gBoard;
var gLevel;
var gStartTime;
var gWatchInterval;
var gLivesUsedCouter = 0;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};


function initGame() {
    gLevel = {
        SIZE: 16,
        MINES: 2,
        LIVES: 2
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
            gLevel.LIVES = 2;
            break;
        case 64:
            gLevel.MINES = 12;
            gLevel.LIVES = 3;
            break;
        case 144:
            gLevel.MINES = 30;
            gLevel.LIVES = 3;
            break;
    }

    showMinesCounter()
    showLives()
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
                    strHTML += `<td style="background-color: lightgrey; border: 1px solid grey;"><b>${currCell.minesAroundCount}</b></td>\n`
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
            board[i][j].minesAroundCount = countNeighbors(i, j, board);
            // console.log('minesAroundCount', board[i][j].minesAroundCount);
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
        gBoard[i][j].isShown = true;
        startStopWatch();
        randomMinesPos(i, j);
        setMinesNegsCount(gBoard);
    }
    removeHitMsg()

    if (gGame.isOn || gBoard[i][j].isMine) {
        var currCell = gBoard[i][j]
        currCell.isShown = true;

        if (currCell.isMine) {
            if (gLevel.LIVES === 1) {
                gGame.isOn = false;
                endStopWatch()
                var elbtn = document.querySelector('.restart');
                elbtn.innerText = LOSE;
                gLevel.LIVES--
                gLivesUsedCouter++
                console.log('YOU LOSE');
            } else {
                gLevel.LIVES--
                gLivesUsedCouter++
            }
            showLives()
            hitMineMsg()
        }
        if (currCell.minesAroundCount === 0) {
            expandShown(gBoard, i, j);
            gGame.shownCount++;
        } else gGame.shownCount++;


        console.log('gGame.shownCount', gGame.shownCount);
    }
    renderBoard();
    checkGameOver()

}

function expandShown(board, i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x >= board.length) continue;
        for (var y = j - 1; y <= j + 1; y++) {
            if (y < 0 || y >= board[i].length) continue;
            if (board[x][y].isMarked || board[x][y].isShown) continue;
            if (x === i && y === j) continue;
            board[x][y].isShown = true;
            gGame.shownCount++;

            // console.log(board[x][y]);
        }
    }
}

function cellMarked(elCell, i, j) {
    removeHitMsg()
    var currCell = gBoard[i][j];
    if (currCell.isMarked) {
        elCell.innerText = '';
        currCell.isMarked = false;
        gGame.markedCount--
        showMinesCounter()
    } else if (gGame.isOn) {
        elCell.innerText = FLAG;
        currCell.isMarked = true;
        gGame.markedCount++
        showMinesCounter()
    }
    checkGameOver()
}

function checkGameOver() {
    if (((gLevel.SIZE - gLevel.MINES === gGame.shownCount) && (gLevel.MINES === gGame.markedCount)) ||
        (gGame.markedCount + gGame.shownCount === gLevel.SIZE)) {
        endStopWatch()
        gGame.isOn = false;
        var elbtn = document.querySelector('.restart');
        elbtn.innerText = WIN;
        console.log('YOU WIN');
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


function restartGame() {
    endStopWatch();
    var elbtn = document.querySelector('.restart');
    elbtn.innerText = SMILEI;
    var elTime = document.querySelector('.time');
    elTime.innerText = `000`
    var elMsg = document.querySelector('p');
    elMsg.innerText = `Good Luck!`;
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    initGame();
}

function showLives() {
    var elLives = document.querySelector('.liv-count');
    elLives.innerText = `${gLevel.LIVES}`;
}

function hitMineMsg() {
    var elMsg = document.querySelector('p');
    if (gLevel.LIVES === 0) elMsg.innerText = `GEME OVER !`;
    else elMsg.innerText = `OOPS! you steped on a mine.`;
}

function removeHitMsg() {
    var elMsg = document.querySelector('p');
    elMsg.innerText = ``;
}

function randomMinesPos(cellI, cellJ) {
    for (var i = 1; i <= gLevel.MINES; i++) {
        var randIdxI = getRandomInt(0, gBoard.length - 1);
        var randIdxJ = getRandomInt(0, gBoard[0].length - 1);
        if (!gBoard[randIdxI][randIdxJ].isMine &&
            ((randIdxI !== cellI) && (randIdxJ !== cellJ))) {
            gBoard[randIdxI][randIdxJ].isMine = true;
        } else i--
    }
    console.table(gBoard);
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