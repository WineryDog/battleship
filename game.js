import Ship from './ship.js';
import Gameboard from './gameboard.js';
import Player from './player.js';

export const game = (() => {
  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateXY(set, playerBoard) {
    let rdmX, rdmY;
    let coordinates;

    do {
      rdmX = randomInteger(0, playerBoard.board.length - 1);
      rdmY = randomInteger(0, playerBoard.board.length - 1);
      coordinates = `${rdmX},${rdmY}`;
    } while (set.has(coordinates));

    // console.log(`Generated coordinates: ${coordinates}`);
    return [rdmX, rdmY];
  }

  const autoPlace = (playerBoard) => {
    const busyCells = new Set();

    function checkNextCells(row, col, ship, orientation) {
      let curRow = row;
      let curCol = col;

      for (let start = 0; start < ship.length - 1; start++) {
        if (orientation === 'horizontal') {
          curCol += 1;
        } else if (orientation === 'vertical') {
          curRow += 1;
        }

        const coordinates = `${curRow},${curCol}`;

        if (busyCells.has(coordinates)) {
          return false;
        }
      }

      return true;
    }

    function markCells(row, col, ship, orientation) {
      let curRow = row;
      let curCol = col;

      busyCells.add(`${curRow},${curCol}`);

      for (let start = 0; start < ship.length - 1; start++) {
        if (orientation === 'horizontal') {
          curCol += 1;
          busyCells.add(`${curRow},${curCol}`);
        } else if (orientation === 'vertical') {
          curRow += 1;
          busyCells.add(`${curRow},${curCol}`);
        }
      }
    }

    function getRdmValidXY(ship) {
      let xAxis = false;
      let yAxis = false;
      let rdmRow, rdmCol;

      while (!xAxis && !yAxis) {
        [rdmRow, rdmCol] = generateXY(busyCells, playerBoard);

        if (playerBoard.checkBounds(ship.length, rdmCol)) {
          xAxis = checkNextCells(rdmRow, rdmCol, ship, 'horizontal');
        }
        if (playerBoard.checkBounds(ship.length, rdmRow)) {
          yAxis = checkNextCells(rdmRow, rdmCol, ship, 'vertical');
        }
      }
      return [xAxis, yAxis, rdmRow, rdmCol];
    }

    function placeShipRdm(xAsis, yAxis, rdmRow, rdmCol, ship) {
      if (xAsis && yAxis) {
        const options = ['horizontal', 'vertical'];
        const chosenAxis = options[randomInteger(0, options.length - 1)];
        // console.log(`Randomly chosen axis: ${chosenAxis}`);
        if (chosenAxis === 'horizontal') {
          playerBoard.placeShip(rdmRow, rdmCol, ship, 'horizontal');
          markCells(rdmRow, rdmCol, ship, 'horizontal');
        } else {
          playerBoard.placeShip(rdmRow, rdmCol, ship, 'vertical');
          markCells(rdmRow, rdmCol, ship, 'vertical');
        }
      } else if (xAsis) {
        // console.log('Only horizontal is available');
        playerBoard.placeShip(rdmRow, rdmCol, ship, 'horizontal');
        markCells(rdmRow, rdmCol, ship, 'horizontal');
      } else if (yAxis) {
        // console.log('Only vertical is available');
        playerBoard.placeShip(rdmRow, rdmCol, ship, 'vertical');
        markCells(rdmRow, rdmCol, ship, 'vertical');
      }
    }

    playerBoard.fleet.forEach((ship) => {
      const [xAsis, yAxis, rdmRow, rdmCol] = getRdmValidXY(ship);
      placeShipRdm(xAsis, yAxis, rdmRow, rdmCol, ship);
    });
    // console.log(busyCells);
  };

  function autoAttack(opponentGB, lastShotRes, lastHitXY) {
    let rdmRow, rdmCol;
    // console.log('My lastShot result: ' + lastShotRes);
    // console.log('My lastHit value: ' + lastHitXY);

    // miss or game start case
    if (lastShotRes !== 'x') {
      [rdmRow, rdmCol] = generateXY(opponentGB.shots, opponentGB);
      // console.log(rdmRow + ' ' + rdmCol);
      // hit case
    } else {
      [rdmRow, rdmCol] = shotAdjacent(opponentGB, lastHitXY);
    }
    opponentGB.receiveAttack(rdmRow, rdmCol);
    // // console.log(opponentGB.shots);
    return [rdmRow, rdmCol];
  }

  function shotAdjacent(opponentGB, lastHitXY) {
    let rdmRow, rdmCol;
    const lastShotStr = lastHitXY;
    const [lastShotX, lastShotY] = lastShotStr.split(',').map(Number);
    // console.log('LAST SHOT: ' + lastShotStr);

    const potentialCoordinates = [
      [lastShotX - 1, lastShotY], // up
      [lastShotX, lastShotY + 1], // right
      [lastShotX + 1, lastShotY], // down
      [lastShotX, lastShotY - 1], // left
    ].filter(([row, col]) => {
      return (
        opponentGB.board?.[row]?.[col] !== undefined &&
        !opponentGB.shots.has(`${row},${col}`)
      );
    });

    // console.log('POTENTIAL XY: ' + potentialCoordinates);

    if (potentialCoordinates.length > 0) {
      const [validX, validY] =
        potentialCoordinates[
          Math.floor(Math.random() * potentialCoordinates.length)
        ];
      // console.log('Randomly selected coordinates:', validX, validY);
      [rdmRow, rdmCol] = [validX, validY];
    } else {
      // console.log('No valid coordinates found');
      [rdmRow, rdmCol] = generateXY(opponentGB.shots, opponentGB);
    }
    return [rdmRow, rdmCol];
  }

  return { autoPlace, autoAttack };
})();
