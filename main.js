import { createBoard, DIFFICULTIES, handleClick, revealMines, flag, hasWon} from "./board.js";
import { render, buildGrid } from "./render.js";

const boardEl = document.getElementById("board");
const difficultyEl = document.getElementById("difficulty");
const restartEl = document.getElementById("restart");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");

let board;
let gameOver;
let settings = DIFFICULTIES.beginner;

let startTime = 0;
let timerId = 0;

function updateTimer() {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const currentTime = Math.min(999, seconds);

    timerEl.textContent = String(currentTime).padStart(3, "0");
}

function startTimer() {
    stopTimer();
    startTime = Date.now();
    timerId = setInterval(updateTimer, 250);
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    stopTimer();
    timerEl.textContent = "000";
}

function newGame() {
    board = createBoard(settings.rows, settings.cols);
    gameOver = false;

    statusEl.textContent = "";
    buildGrid(board, boardEl);
    render(board, boardEl);
    resetTimer();
    
}

function endGame(message) {
    gameOver = true;
    statusEl.textContent = message;
    updateTimer();
    stopTimer();
}

boardEl.addEventListener("click", (e) => {
    if (gameOver) return;


    const wasFirstClick = !board.minesPlaced;
    const el = e.target.closest(".cell");
    if (!el) return;
    const index = Number(el.dataset.index);

    
    const result = handleClick(board, index, settings.mines);
    if (wasFirstClick && board.minesPlaced) startTimer();
    if (result === "mine") {
        revealMines(board);
        endGame("You lost!");
    } else if (hasWon(board)) {
        endGame("You won!");
    }

    render(board, boardEl);
})

boardEl.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (gameOver) return;

    const el = e.target.closest(".cell");
    if (!el) return;

    flag(board, Number(el.dataset.index));
    render(board, boardEl);
})

restartEl.addEventListener("click", newGame);

difficultyEl.addEventListener("change", () => {
    settings = DIFFICULTIES[difficultyEl.value];
    newGame();
});

newGame();