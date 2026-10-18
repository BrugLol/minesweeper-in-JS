export const DIFFICULTIES = {
    beginner: { rows:9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 },
};



export function createBoard(rows, cols) {
    const cells = Array.from({ length: rows * cols}, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0
    }));
    
    return {rows, cols, cells, minesPlaced: false};
}

export function neighbors(board, index) {
    const rows = Math.floor(index / board.cols);
    const cols = index % board.cols;

    const result = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = rows + dr;
            const c = cols + dc;

            if (r >= 0 && r < board.rows && c >= 0 && c < board.cols) {
                result.push(r * board.cols + c);
            }
        }
    }

    return result;
}

export function placeMines(board, mineCount, safeIndex) {
    const forbidden = new Set([safeIndex, ...neighbors(board, safeIndex)]);

    const candidates = [];
    for (let i = 0; i < board.cells.length; i++) {
        if (!forbidden.has(i)) candidates.push(i);
    }

    if (mineCount > candidates.length) {
        throw new Error(
            `Cannot place ${mineCount} mines: only ${candidates.length} cells available`
        );   
    }

    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    for (const index of candidates.slice(0, mineCount)) {
        board.cells[index].mine = true;
    }
}

export function minesAdjacent(board) {
    for (let i = 0; i < board.cells.length; i++) {
        let count = 0;

        for (const n of neighbors(board, i)) {
            if (board.cells[n].mine) count++;
        }

        board.cells[i].adjacent = count;
    }
}

export function reveal(board, index) {
  const stack = [index];

  while (stack.length > 0) {
    const current = stack.pop();
    const cell = board.cells[current];

    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;

    if (cell.mine) return "mine";

    if (cell.adjacent === 0) {
      for (const n of neighbors(board, current)) {
        stack.push(n);
      }
    }
  }
  return "ok";
}

export function flag(board, index) {
    const cell = board.cells[index];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
}

export function handleClick(board, index, mineCount) {
    const cell = board.cells[index];
    if (cell.revealed || cell.flagged) return "ok";  

    if (!board.minesPlaced) {
        placeMines(board, mineCount, index);
        minesAdjacent(board);
        board.minesPlaced = true;
    }
    return reveal(board, index);
}

export function hasWon(board) {
    return board.cells.every((cell) => cell.mine || cell.revealed);
}

export function revealMines(board) {
    for (const cell of board.cells) {
        if (cell.mine) cell.revealed = true;
    }
}