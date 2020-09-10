
function getMarkElement(mark) {
    let oMark = "<i class=\"fa fa-circle-o\"></i>"
    let xMark = "<i class=\"fa fa-times\"></i>"
    if (mark === "x")
        return xMark;
    else
        return oMark;
}

function resetBoard(board, buttons, displayMessage) {
    board.dataset.currentTurn = "x";
    board.dataset.turnNumber = "0";
    buttons.forEach(button => {
        button.disabled = false;
        button.innerHTML = "";
        button.dataset.temp = "";
        button.dataset.value = "";
        button.classList.remove("btn-hover");
    });
    displayMessage.innerHTML = getMarkElement("x") + " goes first!";
}

function disableButtons(buttons) {
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function getBoardData(buttons) {
    let i = 0;
    let boardData = [[], [], []]
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            boardData[row].push(buttons[i].dataset.value ? buttons[i].dataset.value : "");
            i++;
        }
    }

    return boardData;
}

function checkWinner(boardData) {
    //rows
    for (let i = 0; i < 3; i++) {
        if (boardData[i][0] === boardData[i][1] && boardData[i][1] === boardData[i][2] && boardData[i][2])
            return [[i, 0], [i, 1], [i, 2]];
    }

    //columns
    for (let i = 0; i < 3; i++) {
        if (boardData[0][i] === boardData[1][i] && boardData[1][i] === boardData[2][i] && boardData[2][i])
            return [[0, i], [1, i], [2, i]];
    }

    //diagonals
    if (boardData[0][0] === boardData[1][1] && boardData[1][1] === boardData[2][2] && boardData[1][1])
        return [[0, 0], [1, 1], [2, 2]];
    if (boardData[2][0] === boardData[1][1] && boardData[1][1] === boardData[0][2] && boardData[1][1])
        return [[2, 0], [1, 1], [0, 2]];

    return [];
}

function highlightWin(winner, buttons) {
    let i = 0;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            winner.forEach(value => {
                if (value[0] === row && value[1] === col)
                    buttons[i].classList.add("btn-hover");
            });
            i++;
        }
    }
}

//main
let buttons = document.querySelectorAll(".cell");
let board = document.querySelector(".board");
let restartBtn = document.querySelector(".restart-btn");
let displayMessage = document.querySelector(".display-msg");


buttons.forEach((button) => {
    button.addEventListener("mouseenter", e => {
        if (!button.innerHTML) {
            button.dataset.temp = "1";
            button.classList.add("btn-hover")
            button.innerHTML = getMarkElement(board.dataset.currentTurn);
        }
    })
});

buttons.forEach((button) => {
    button.addEventListener("mouseleave", e => {
        if (button.dataset.temp === "1") {
            button.classList.remove("btn-hover");
            button.innerHTML = "";
            button.dataset.temp = "0";
        }
    })
});

buttons.forEach((button) => {
    button.addEventListener("click", e => {
        if (button.dataset.temp === "1") {

            let currentTurn = board.dataset.currentTurn;
            button.dataset.value = currentTurn;
            button.innerHTML = getMarkElement(currentTurn);

            button.dataset.temp = "0";
            button.classList.remove("btn-hover");

            let nextTurn = currentTurn === "x" ? "o" : "x";
            board.dataset.currentTurn = nextTurn;

            let turnNumber = parseInt(board.dataset.turnNumber) + 1;
            board.dataset.turnNumber = turnNumber;

            let winner = [];
            if (turnNumber >= 5) {
                winner = checkWinner(getBoardData(buttons), currentTurn);
            }

            if (winner.length) {
                displayMessage.innerHTML = `${getMarkElement(currentTurn)} is the winner!`
                disableButtons(buttons);
                highlightWin(winner, buttons);
            }
            else if (turnNumber === 9) {
                displayMessage.innerHTML = `It's a tie!`
            }
            else {
                displayMessage.innerHTML = `It's ${getMarkElement(nextTurn)} turn!`
            }
        }
    });
});

restartBtn.addEventListener("click", (e) => {
    resetBoard(board, buttons, displayMessage);
});
