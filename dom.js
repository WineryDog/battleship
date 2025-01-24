import { game } from './game.js';
import Player from './player.js';
import Gameboard from './gameboard.js';
import boomImage from './images/boom.png';

const dom = (() => {
  const gameboardDiv = document.querySelector('.gameboards');
  const p1GB = document.querySelector('.p1-gb');
  const p2GB = document.querySelector('.p2-gb');
  const fleet = document.querySelector('.fleet');
  const axisToggle = document.getElementById('cb3');

  let cpuLastShot;
  let cpuLastHit;
  let isGameStartable = false;
  let isGameActive = false;

  let draggedShip = {
    container: null,
    dragIndex: null,
    shipIstance: null,
    shipName: null,
    length: null,
    axis: null,
  };

  let p1 = new Player();
  let computer = new Player();

  function setMessage(message) {
    const messageDiv = document.querySelector('.info');
    messageDiv.innerHTML = message;
  }

  function initDom() {
    p1 = new Player();
    computer = new Player();
    isGameStartable = false;
    isGameActive = false;

    fleet.innerHTML = '';
    dom.renderFleetPreview();

    dom.renderFleet(p1.playerGb, p1GB);
    dom.renderBlankGrid(computer.playerGb, p2GB);
    dom.setMessage('Place your ships');
  }

  function setPrewIndex(e) {
    // console.log('PREV INDEX:');
    // console.log(e.target.dataset.index);
    draggedShip.dragIndex = e.target.dataset.index;
  }

  function renderFleetPreview() {
    // console.log(p1.playerGb.fleet);

    p1.playerGb.fleet.forEach((ship) => {
      const shipPrewDiv = document.createElement('div');
      shipPrewDiv.className = `preview-container`;
      shipPrewDiv.dataset.ship = `${ship.name}`;
      shipPrewDiv.dataset.axis = 'horizontal';
      shipPrewDiv.draggable = true;

      for (let j = 0; j < ship.length; j++) {
        const shipPrewCellDiv = document.createElement('div');
        shipPrewCellDiv.className = `${ship.name} preview`;
        shipPrewCellDiv.dataset.index = j; // Indice della cella
        shipPrewCellDiv.dataset.ship = `${ship.name}`;

        shipPrewDiv.addEventListener('mousedown', setPrewIndex);

        shipPrewDiv.appendChild(shipPrewCellDiv);
      }

      shipPrewDiv.addEventListener('dragstart', dragStart);

      fleet.appendChild(shipPrewDiv);
    });
  }

  function dragStart(e) {
    const targetShipIst = p1.playerGb.fleet.find(
      (ship) => ship.name === e.target.dataset.ship
    );

    draggedShip.container = e.target;
    draggedShip.shipIstance = targetShipIst;
    draggedShip.length = e.target.children.length;
    draggedShip.axis = e.target.dataset.axis;

    // console.log('Dragging:', draggedShip);
  }

  function flip() {
    const prevShips = Array.from(fleet.children);
    prevShips.forEach((shipPrev) => {
      if (axisToggle.checked) {
        shipPrev.dataset.axis = 'vertical';
        shipPrev.classList.add('vertical');
      } else {
        shipPrev.dataset.axis = 'horizontal';
        shipPrev.classList.remove('vertical');
      }
    });
  }

  axisToggle.addEventListener('change', flip);

  function renderAutoplace() {
    if (!isGameActive) {
      p1.playerGb = new Gameboard(10);
      game.autoPlace(p1.playerGb);
      dom.renderFleet(p1.playerGb, p1GB);
      fleet.innerHTML = '';
      isGameStartable = true;
      dom.setMessage('Press start to begin');
    }
  }

  const autoPlaceBtn = document.querySelector('.autoplace');
  autoPlaceBtn.addEventListener('click', renderAutoplace);

  const resetBtn = document.querySelector('.reset');
  resetBtn.addEventListener('click', initDom);

  const startGame = () => {
    if (isGameStartable) {
      isGameStartable = false;
      isGameActive = true;
      dom.setMessage('');
      game.autoPlace(computer.playerGb);
      dom.renderFleet(computer.playerGb, p2GB, 'blank', p1.playerGb);
    }
  };

  const startButton = document.querySelector('.start');
  startButton.addEventListener('click', startGame);

  function renderEmptyCell(computerGB, row, col, opponentGb) {
    const cell = document.createElement('div');
    cell.className = `cell ${row}-${col} blank`;
    cell.dataset.x = row;
    cell.dataset.y = col;

    cell.addEventListener('click', function handleClick(event) {
      // console.log(`Cell ${row}-${col} clicked!`);

      computerGB.receiveAttack(row, col);

      const content = computerGB.board[row][col];
      cell.className = `cell ${row}-${col} ${content}`;

      if (content !== 'm') {
        const img = document.createElement('img');
        img.alt = 'Boom';
        img.src = boomImage;
        img.className = 'hit-img';
        cell.appendChild(img);
        // Debug
        // // console.log(computerGB);

        //check computer Gameover
        if (computerGB.areAllShipsSunk()) {
          // console.log('COMPUTER LOST: GAME OVER');
          dom.setMessage('COMPUTER LOST: GAME OVER!');
          dom.renderFleet(computerGB, p2GB);
          return;
        }
        return;
      }

      // Debug
      // // console.log(computerGB);

      //Respond to attack
      let cpuAttX, cpuAttY;
      let attackResult;
      do {
        [cpuAttX, cpuAttY] = game.autoAttack(
          opponentGb,
          cpuLastShot,
          cpuLastHit
        );

        attackResult = updateCell('.p1-gb', opponentGb, cpuAttX, cpuAttY);
        //check  player Gameover
        if (opponentGb.areAllShipsSunk()) {
          // console.log('PLAYER LOST: GAME OVER');
          dom.setMessage('PLAYER LOST: GAME OVER!');
          dom.renderFleet(opponentGb, p1GB);
          return;
        }
      } while (attackResult === 'x');

      //End cell interaction
      cell.removeEventListener('click', handleClick);
    });

    return cell;
  }

  function renderCell(gameboard, row, col) {
    const cell = document.createElement('div');
    const content = gameboard[row][col];
    cell.className = `cell ${row}-${col} ${content}`;
    cell.dataset.x = row;
    cell.dataset.y = col;
    cell.id = `${row}-${col}`;
    cell.draggable = false;

    if (content === 'x') {
      const img = document.createElement('img');
      img.alt = 'Boom';
      img.src = boomImage;
      img.className = 'hit-img';
      cell.appendChild(img);
    }

    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', dropShip);

    return cell;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dropShip(e) {
    if (draggedShip.container) {
      const startIdX = e.target.getAttribute('data-x');
      const startIdY = e.target.getAttribute('data-y');
      // console.log(startIdX + ' ' + startIdY);
      const orientation = draggedShip.axis;
      let pointerX, pointerY;
      switch (orientation) {
        case 'horizontal':
          pointerX = startIdX;
          pointerY = startIdY - draggedShip.dragIndex;
          break;
        case 'vertical':
          pointerX = startIdX - draggedShip.dragIndex;
          pointerY = startIdY;
          break;
      }

      // Debug
      // // console.log('PLACE SHIP:');
      // // console.log(draggedShip.shipIstance.name);
      // // console.log('IN:');
      // // console.log(pointerX + ' ' + pointerY);

      const isDragValid = p1.playerGb.placeShip(
        pointerX,
        pointerY,
        draggedShip.shipIstance,
        orientation
      );
      // console.log(p1.playerGb);
      if (isDragValid) {
        // console.log(draggedShip.container);
        fleet.removeChild(draggedShip.container);
        dom.renderFleet(p1.playerGb, p1GB);
        draggedShip = {
          container: null,
          dragIndex: null,
          shipIstance: null,
          shipName: null,
          length: null,
          axis: null,
        };
        if (fleet.innerHTML === '') {
          isGameStartable = true;
          dom.setMessage('Press start to begin');
        }
      }
    }
  }

  function updateCell(selector, gameboard, row, col) {
    const selectCell = document.querySelector(
      `${selector}>.row>[data-x="${row}"][data-y="${col}"]`
    );
    // Debug
    // // console.log(selectCell.className);

    const content = gameboard.board[row][col];
    selectCell.className = `cell ${row}-${col} ${content}`;
    cpuLastShot = content;

    if (content !== 'm') {
      const img = document.createElement('img');
      img.alt = 'Boom';
      img.src = boomImage;
      img.className = 'hit-img'; // Classe per eventuale styling
      selectCell.appendChild(img);
      cpuLastHit = `${row},${col}`;
    }

    return content;
  }

  function renderFleet(
    gameboard,
    playerDiv,
    blank = false,
    opponentGb = false
  ) {
    if (!gameboard || !gameboard.board) {
      console.error('Gameboard o board non valido:', gameboard);
      return;
    }

    playerDiv.innerHTML = '';

    gameboard.board.forEach((row, rowI) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = `row ${rowI}`;

      row.forEach((_, colI) => {
        const cell = blank
          ? renderEmptyCell(gameboard, rowI, colI, opponentGb)
          : renderCell(gameboard.board, rowI, colI);
        rowDiv.appendChild(cell);
      });

      playerDiv.appendChild(rowDiv);
    });
  }

  function renderBlankGrid(gameboard, div) {
    if (!gameboard || !gameboard.board) {
      console.error('Gameboard o board non valido:', gameboard);
      return;
    }

    div.innerHTML = '';

    gameboard.board.forEach((row, rowI) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = `row ${rowI}`;

      row.forEach((_, colI) => {
        const cell = document.createElement('div');
        cell.className = `cell ${rowI}-${colI} blank`;
        rowDiv.appendChild(cell);
      });

      div.appendChild(rowDiv);
    });
  }

  return {
    startGame,
    renderCell,
    renderFleet,
    renderFleetPreview,
    renderBlankGrid,
    initDom,
    setMessage,
  };
})();

export default dom;
