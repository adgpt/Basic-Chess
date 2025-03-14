// Initialize the chess game using Chess.js library
const game = new Chess();

/**
 * Renders the chess board and pieces dynamically.
 * Creates an 8x8 grid of squares and places chess pieces according to the current game state.
 * Each square is styled and has event listeners for interaction.
 */
function renderBoard() {
  const boardContainer = document.getElementById('board');
  boardContainer.innerHTML = ''; // Clear any previous board

  const board = game.board();
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      // Create each square
      const squareEl = document.createElement('div');
      squareEl.classList.add('square');
      // Alternate colors: light vs dark
      if ((row + col) % 2 === 0) {
        squareEl.classList.add('light');
      } else {
        squareEl.classList.add('dark');
      }
      
      // Define algebraic notation for the square (e.g., "a8")
      const squareNotation = String.fromCharCode(97 + col) + (8 - row);
      squareEl.setAttribute('data-square', squareNotation);
      squareEl.setAttribute('tabindex', '0'); // For keyboard accessibility
      
      // If there is a piece on this square, render it
      const piece = board[row][col];
      if (piece) {
        const pieceEl = document.createElement('span');
        pieceEl.classList.add('piece');
        const whitePieces = { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' };
        const blackPieces = { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' };
        pieceEl.textContent = piece.color === 'w' ? whitePieces[piece.type] : blackPieces[piece.type];
        // Accessibility: Set an aria-label for the piece
        pieceEl.setAttribute('aria-label', (piece.color === 'w' ? 'White ' : 'Black ') + piece.type.toUpperCase());
        squareEl.appendChild(pieceEl);
      }
      
      // Add click event listener to handle selection and moves
      squareEl.addEventListener('click', handleSquareClick);
      boardContainer.appendChild(squareEl);
    }
  }
  // Update move history and turn indicator after rendering the board
  updateHistoryDisplay();  // Feature 1: Persistent move history
  updateTurnIndicator();   // Feature 2: Turn indicator
}

// Tracks the currently selected square for move execution
let selectedSquare = null;

/**
 * Handles click events on board squares.
 * If no square is selected, shows valid moves for the clicked piece.
 * If a square is already selected, attempts to make a move.
 */
function handleSquareClick(e) {
  const clickedSquare = e.currentTarget.getAttribute('data-square');
  
  if (!selectedSquare) {
    // Check for valid moves from the clicked square
    const moves = game.moves({ square: clickedSquare, verbose: true });
    if (moves.length === 0) return; // No valid moves
    selectedSquare = clickedSquare;
    highlightSquare(clickedSquare);
    moves.forEach(move => highlightSquare(move.to));
  } else {
    // Attempt the move from the selected square to the clicked square
    const move = game.move({ from: selectedSquare, to: clickedSquare, promotion: 'q' });
    clearHighlights();
    selectedSquare = null;
    if (move) {
      renderBoard();
      checkGameStatus();
    }
  }
}

/**
 * Highlights a square visually.
 * Used to indicate selected squares and valid moves.
 */
function highlightSquare(squareId) {
  const squareEl = document.querySelector(`.square[data-square="${squareId}"]`);
  if (squareEl) {
    squareEl.classList.add('highlight');
  }
}

/**
 * Clears all square highlights.
 * Typically called after a move is made or selection is canceled.
 */
function clearHighlights() {
  document.querySelectorAll('.square').forEach(sq => sq.classList.remove('highlight'));
}

/**
 * Checks the current game state for checkmate, stalemate, or check.
 * Displays a modal dialog if the game is over.
 */
function checkGameStatus() {
  if (game.in_checkmate()) {
    showModal("Checkmate! Game Over.");
  } else if (game.in_stalemate()) {
    showModal("Stalemate! Game Over.");
  } else if (game.in_check()) {
    console.log("Check!");
  }
}

/**
 * Updates the move history display panel.
 * Lists each move made in the game.
 */
function updateHistoryDisplay() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  const history = game.history();
  history.forEach((move, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${move}`;
    historyList.appendChild(li);
  });
}

/**
 * Updates the turn indicator to display whose turn it is.
 */
function updateTurnIndicator() {
  const turnIndicator = document.getElementById('turnIndicator');
  const turn = game.turn() === 'w' ? 'White' : 'Black';
  turnIndicator.textContent = `Turn: ${turn}`;
}

// Modal handling for game-over messages and restart functionality
const modal = document.getElementById('gameModal');
const gameMessage = document.getElementById('gameMessage');
const restartButton = document.getElementById('restartButton');

function showModal(message) {
  gameMessage.textContent = message;
  modal.classList.remove('hidden');
}

function hideModal() {
  modal.classList.add('hidden');
}

restartButton.addEventListener('click', () => {
  hideModal();
  game.reset();
  renderBoard();
});

// Feature 3: Undo Options
document.getElementById('undoLastMove').addEventListener('click', () => {
  game.undo();
  renderBoard();
});

document.getElementById('undoTwoMoves').addEventListener('click', () => {
  game.undo();
  game.undo();
  renderBoard();
});

// Feature 4: Save & Load Game Functionality (with move history)
document.getElementById('saveGame').addEventListener('click', () => {
  // Save current board state and move history to localStorage
  localStorage.setItem('chessGameFen', game.fen());
  localStorage.setItem('chessGameHistory', JSON.stringify(game.history()));
  alert('Game saved!');
});

document.getElementById('loadGame').addEventListener('click', () => {
  const savedHistory = localStorage.getItem('chessGameHistory');
  if (savedHistory) {
    const moves = JSON.parse(savedHistory);
    // Reset the game and replay the saved moves to restore full state and history
    game.reset();
    moves.forEach(move => {
      game.move(move);
    });
    renderBoard();
    alert('Game loaded!');
  } else {
    alert('No saved game found.');
  }
});

// Initialize the board when the page loads
renderBoard();
