const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

const grid = 32;
const tetrominoSequence = [];

// Define tetromino shapes and their colors
const tetrominoes = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'O': [
        [1, 1],
        [1, 1],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
};

const colors = {
    'I': 'cyan',
    'J': 'blue',
    'L': 'orange',
    'O': 'yellow',
    'Z': 'red',
    'S': 'green',
    'T': 'purple',
};

// Initialize the playfield
const playfield = [];

// Populate the playfield with 0's
for (let row = 0; row < 20; row++) {
    playfield[row] = [];
    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

// Get the next tetromino from the sequence
function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
        Object.keys(tetrominoes).forEach(tetromino => {
            tetrominoSequence.push(tetromino);
        });
        shuffle(tetrominoSequence);
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominoes[name];

    return { name, matrix };
}

// Rotate tetromino matrix
function rotate(matrix) {
    const N = matrix.length;
    const rotatedMatrix = [];

    for (let i = 0; i < N; i++) {
        rotatedMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotatedMatrix[i][j] = matrix[N - j - 1][i];
        }
    }

    return rotatedMatrix;
}

// Check for valid moves
function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                cellCol + col < 0 || 
                cellCol + col >= 10 || 
                cellRow + row >= 20 || 
                playfield[cellRow + row][cellCol + col])
            ) {
                return false;
            }
        }
    }
    return true;
}

// Place tetromino onto the playfield
function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                playfield[tetrominoY + row][tetrominoX + col] = tetromino.name;
            }
        }
    }

    // Clear full rows
    for (let row = 19; row >= 0;) {
        if (playfield[row].every(cell => !!cell)) {
            playfield.splice(row, 1);
            playfield.unshift(new Array(10).fill(0));
        } else {
            row--;
        }
    }

    tetromino = getNextTetromino();
    tetrominoX = 3;
    tetrominoY = 0;
}

// Event listener for key presses
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        const newX = tetrominoX - 1;

        if (isValidMove(tetromino.matrix, tetrominoY, newX)) {
            tetrominoX = newX;
        }
    } else if (e.key === 'ArrowRight') {
        const newX = tetrominoX + 1;

        if (isValidMove(tetromino.matrix, tetrominoY, newX)) {
            tetrominoX = newX;
        }
    } else if (e.key === 'ArrowDown') {
        const newY = tetrominoY + 1;

        if (!isValidMove(tetromino.matrix, newY, tetrominoX)) {
            placeTetromino();
        } else {
            tetrominoY = newY;
        }
    } else if (e.key === 'ArrowUp') {
        rotateTetromino();
    }
});

// Fix rotate function for all tetrominoes
function rotateTetromino() {
    const rotatedMatrix = rotate(tetromino.matrix);

    // If valid, rotate
    if (isValidMove(rotatedMatrix, tetrominoY, tetrominoX)) {
        tetromino.matrix = rotatedMatrix;
    } else {
        // Handle bounds and wall kicks for all tetrominoes
        const offset = tetrominoX > 5 ? -1 : 1;
        if (isValidMove(rotatedMatrix, tetrominoY, tetrominoX + offset)) {
            tetrominoX += offset;
            tetromino.matrix = rotatedMatrix;
        }
    }
}

// Shuffle tetrominoes
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start the game loop
let tetromino = getNextTetromino();
let tetrominoX = 3;
let tetrominoY = 0;

let count = 0;
function loop() {
    requestAnimationFrame(loop);

    if (++count < 35) {
        return;
    }

    count = 0;

    const newY = tetrominoY + 1;

    if (!isValidMove(tetromino.matrix, newY, tetrominoX)) {
        placeTetromino();
    } else {
        tetrominoY = newY;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the playfield
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];
                context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
            }
        }
    }

    // Draw the current tetromino
    context.fillStyle = colors[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                context.fillRect(
                    (tetrominoX + col) * grid,
                    (tetrominoY + row) * grid,
                    grid - 1,
                    grid - 1
                );
            }
        }
    }
}

loop();
