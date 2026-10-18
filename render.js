

export function buildGrid(board, boardEl) {
    boardEl.style.setProperty("--cols", board.cols);
    boardEl.innerHTML = "";

    for (let i = 0; i < board.cells.length; i++) {
        const el = document.createElement("button");
        el.dataset.index = i;
        el.className = "cell";
        boardEl.appendChild(el);
    }
}

export function render(board, boardEl) {
    for (let i = 0; i < board.cells.length; i++) {
        const cell = board.cells[i];
        const el = boardEl.children[i];

        if (cell.flagged) {
            el.textContent = "F";
        } else if (!cell.revealed) {
            el.textContent = "";
        } else {
            el.textContent = cell.mine ? "*" : (cell.adjacent || "");
        }
        
        el.classList.toggle("revealed", cell.revealed);
        el.classList.toggle("flagged", cell.flagged);
        el.dataset.n = cell.adjacent;
    }
}