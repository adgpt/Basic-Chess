// Initialize the chess game using Chess.js library
// This creates a new game instance with the standard starting position
const game = new Chess();

/**
 * Renders the chess board and pieces dynamically
 * Creates an 8x8 grid of squares and places chess pieces according to the current game state
 * Each square is given appropriate styling and event listeners for interaction
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
}

// Tracks the currently selected square for move execution
let selectedSquare = null;

/**
 * Handles click events on board squares
 * Implements the core game interaction logic:
 * 1. If no square is selected, shows valid moves for the clicked piece
 * 2. If a square is already selected, attempts to make a move
 * @param {Event} e - The click event object
 */
function handleSquareClick(e) {
  const clickedSquare = e.currentTarget.getAttribute('data-square');
  
  if (!selectedSquare) {
    // If no square is selected, check for valid moves on the clicked square
    const moves = game.moves({ square: clickedSquare, verbose: true });
    if (moves.length === 0) return; // No moves available
    selectedSquare = clickedSquare;
    highlightSquare(clickedSquare);
    moves.forEach(move => highlightSquare(move.to));
  } else {
    // Attempt to move from the selected square to the clicked square
    const move = game.move({ from: selectedSquare, to: clickedSquare, promotion: 'q' });
    clearHighlights();
    selectedSquare = null;
    if (move) {
      // If move is successful, re-render board and check game state
      renderBoard();
      checkGameStatus();
    }
  }
}

/**
 * Adds visual highlighting to a square on the board
 * Used to show the selected piece and its valid moves
 * @param {string} squareId - The algebraic notation of the square (e.g., "e4")
 */
function highlightSquare(squareId) {
  const squareEl = document.querySelector(`.square[data-square="${squareId}"]`);
  if (squareEl) {
    squareEl.classList.add('highlight');
  }
}

/**
 * Removes highlighting from all squares on the board
 * Called after a move is made or when deselecting a piece
 */
function clearHighlights() {
  document.querySelectorAll('.square').forEach(sq => sq.classList.remove('highlight'));
}

/**
 * Checks the current game state and displays appropriate messages
 * Handles checkmate, stalemate, and check conditions
 * Shows a modal dialog for game-ending states
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

// DOM elements for the game over modal dialog
// Used to display game end messages and provide restart functionality
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

// Initialize the board when the page loads
renderBoard();
