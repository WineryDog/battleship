import Ship from './ship.js';

class Gameboard {
  constructor(size) {
    this.board = this.createGb(size);
    this.fleet = this.createFleet();
    this.shots = new Set();
  }
}

const gbFunctions = {
  createGb(size) {
    const grid = Array.from({ length: size }, () => Array(size).fill('w'));
    return grid;
  },
  createFleet() {
    const ships = [
      ['carrier', 5],
      ['battleship', 4],
      ['cruiser', 3],
      ['submarine', 3],
      ['destroier', 2],
    ];
    const shipIstances = ships.map(([name, length]) => new Ship(name, length));
    return shipIstances;
  },
  placeShip(row, col, ship, orientation) {
    const shipLength = ship.length;

    const isPlacementValid = () => {
      if (orientation === 'horizontal') {
        for (let i = 0; i < shipLength; i++) {
          if (
            col + i >= this.board[0].length || // Out of bounds
            this.board[row][col + i] !== 'w' // Busy Cell
          ) {
            return false;
          }
        }
      } else if (orientation === 'vertical') {
        for (let i = 0; i < shipLength; i++) {
          if (
            row + i >= this.board.length || // Out of bounds
            this.board[row + i][col] !== 'w' // Busy Cell
          ) {
            return false;
          }
        }
      }
      return true;
    };

    if (!isPlacementValid()) {
      // console.log('Invalid placement: Out of bounds or cell busy');
      return false;
    }

    // Ship axis
    if (orientation === 'horizontal') {
      for (let i = 0; i < shipLength; i++) {
        this.board[row][col + i] = ship.name;
      }
    } else if (orientation === 'vertical') {
      for (let i = 0; i < shipLength; i++) {
        this.board[row + i][col] = ship.name;
      }
    }

    return true;
  },

  checkBounds(shipLength, currentI) {
    const shipEndPoint = currentI + shipLength;
    if (shipEndPoint > this.board.length) {
      return false;
    } else {
      return true;
    }
  },
  receiveAttack(row, col) {
    const recordShot = `${row},${col}`;
    if (!this.shots.has(recordShot)) {
      this.shots.add(recordShot);
      if (this.board[row][col] != 'w') {
        const targetShip = this.fleet.find(
          (ship) => ship.name === this.board[row][col]
        );
        targetShip.hit();
        this.board[row][col] = 'x';
      } else {
        this.board[row][col] = 'm';
      }
    }
  },
  areAllShipsSunk() {
    return this.fleet.every((ship) => ship.sunk);
  },
};

Object.assign(Gameboard.prototype, gbFunctions);

export default Gameboard;
