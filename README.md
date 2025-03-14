# Chess Game MVP

A simple, interactive chess game implementation using vanilla JavaScript and Chess.js library. This project provides a clean, accessible web-based chess interface where two players can play chess following standard rules.

## Features

- Interactive chess board with piece movement
- Legal move validation using Chess.js
- Visual highlighting of selected pieces and possible moves
- Game state tracking (checkmate, stalemate, check)
- Accessible design with keyboard navigation
- Unicode chess pieces
- Restart game functionality

## Setup

1. Clone this repository to your local machine
2. Open `index.html` in a modern web browser
3. Start playing!

## How to Play

1. The game starts with white's turn
2. Click on a piece to select it
   - Valid moves will be highlighted on the board
3. Click on a highlighted square to move the selected piece
   - If the move is legal, the piece will move
   - If not, nothing will happen
4. The game continues until one of these conditions is met:
   - Checkmate: A player wins
   - Stalemate: The game ends in a draw

## Technical Details

- Built with vanilla JavaScript
- Uses Chess.js for game logic and move validation
- Implements a responsive and accessible design
- Unicode chess pieces for rendering

## Accessibility

The game includes several accessibility features:
- Keyboard navigation support
- ARIA labels for pieces
- High contrast colors for the board
- Clear visual feedback for selected pieces and possible moves

## Future Improvements

- Add move history
- Implement time controls
- Add AI opponent
- Save game state
- Add sound effects
- Support piece promotion dialog