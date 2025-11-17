# Battleship

A browser-based implementation of the classic Battleship game. Play against an AI opponent that strategically targets your fleet while you attempt to sink theirs first.

## Features

- **Interactive Ship Placement**: Drag and drop ships onto your board or use auto-placement
- **AI Opponent**: Computer player with smart targeting logic that attacks adjacent cells after a hit
- **Visual Feedback**: Clear hit/miss indicators with visual effects
- **Fleet Management**: Preview and manage 5 different ship types
- **Responsive Grid**: 10x10 game boards for both players
- **Game Controls**: Start, restart, and auto-place functionality

## Technologies Used

- **JavaScript (ES6 Modules)**: Core game logic and DOM manipulation
- **Webpack**: Module bundling and development server
- **Jest & Babel**: Unit testing framework
- **HTML5 & CSS3**: User interface and styling
- **Git**: Version control

## How to Play

1. **Setup Phase**:

   - Drag ships from the fleet preview onto your game board
   - Toggle orientation between horizontal/vertical using the axis toggle
   - Or click "Auto Place" to randomly position all ships
   - Click "Start Game" when all ships are placed

2. **Combat Phase**:

   - Click on the opponent's board to attack
   - 'X' marks indicate hits
   - 'M' marks indicate misses
   - The AI automatically attacks after your turn
   - First player to sink all opponent ships wins

3. **Game Over**:
   - Click "Start Over" to play again

## Fleet Composition

- **Carrier**: 5 cells
- **Battleship**: 4 cells
- **Cruiser**: 3 cells
- **Submarine**: 3 cells
- **Destroyer**: 2 cells

## Game Logic

### Ship Placement

- Ships cannot overlap
- Ships must fit entirely within the board boundaries
- Auto-placement ensures valid ship positioning

### AI Strategy

- Random targeting on first attack or after a miss
- Attacks adjacent cells (up, down, left, right) after a hit
- Continues targeting adjacent cells until all valid positions are exhausted

### Win Condition

- Game ends when all ships in a fleet are sunk
- Winner is announced via on-screen message

## Development

This project uses:

- **Webpack Dev Server**: Hot module reloading during development
- **ES6 Modules**: Modern JavaScript module system
- **Jest**: Test-driven development support
- **CSS Loader**: Style injection and management

## License

ISC

## Repository

[GitHub](https://github.com/WineryDog/battleship)
