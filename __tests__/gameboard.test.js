import Ship from '../ship.js';
import Gameboard from '../gameboard.js';

// beforeEach(() => {
//   testShip = new Ship('test', 3);
// });

test('Gameboard should be of 3 rows and 3 columns filled with 9 "w"', () => {
  const testGB = new Gameboard(3);
  expect(testGB.board).toEqual([
    ['w', 'w', 'w'],
    ['w', 'w', 'w'],
    ['w', 'w', 'w'],
  ]);
});

test('Gameboards should be able to place ships at specific coordinates in a horizontal orientation by calling the ship class', () => {
  const testGB = new Gameboard(10);
  const testShip = new Ship('test', 3);
  testGB.placeShip(3, 1, testShip, 'horizontal');

  expect(testGB.board[3][1]).toEqual('test');
  expect(testGB.board[3][2]).toEqual('test');
  expect(testGB.board[3][3]).toEqual('test');
});

test('Gameboards should be able to place ships at specific coordinates in a vertical orientation by calling the ship class', () => {
  const testGB = new Gameboard(10);
  const testShip = new Ship('test', 3);
  testGB.placeShip(3, 1, testShip, 'vertical');

  expect(testGB.board[3][1]).toEqual('test');
  expect(testGB.board[4][1]).toEqual('test');
  expect(testGB.board[5][1]).toEqual('test');
});

test('Gameboards should not place ships on spaces already occupied', () => {
  const testGB = new Gameboard(10);
  const testShip1 = new Ship('test', 3);
  const testShip2 = new Ship('test', 3);
  const rejectedShip1 = new Ship('rejected', 3);
  const rejectedShip2 = new Ship('rejected', 3);

  testGB.placeShip(3, 1, testShip1, 'vertical');
  testGB.placeShip(7, 1, testShip2, 'horizontal');

  expect(testGB.placeShip(3, 1, rejectedShip1, 'vertical')).toEqual(false);
  expect(testGB.placeShip(7, 1, rejectedShip2, 'horizontal')).toEqual(false);
});

test('Gameboards should not place ships out of bounds', () => {
  const testGB = new Gameboard(10);
  const testShip = new Ship('test', 3);

  expect(testGB.placeShip(13, 1, testShip, 'vertical')).toEqual(false);
  expect(testGB.placeShip(7, 13, testShip, 'horizontal')).toEqual(false);
});

test('Gameboards should not place ships out of bounds', () => {
  const testGB = new Gameboard(10);
  const testShip = new Ship('test', 3);

  expect(testGB.placeShip(13, 1, testShip, 'vertical')).toEqual(false);
  expect(testGB.placeShip(7, 13, testShip, 'horizontal')).toEqual(false);
});

test('receiveAttack should hit a placed ship of the fleet and change its hit count', () => {
  const testGB = new Gameboard(10);
  const submarine = testGB.fleet.find((ship) => ship.name === 'submarine');
  testGB.placeShip(2, 1, submarine, 'horizontal');

  testGB.receiveAttack(2, 1);

  expect(submarine.hits).toEqual(1);
});

test('receiveAttack should record a missed shot and change the cell status', () => {
  const testGB = new Gameboard(10);

  testGB.receiveAttack(2, 1);

  expect(testGB.shots.has('2,1')).toEqual(true);
  expect(testGB.board[2][1]).toEqual('m');
});

test('Gameboards should be able to report whether or not all of their ships have been sunk', () => {
  const testGB = new Gameboard(10);

  const carrier = testGB.fleet.find((ship) => ship.name === 'carrier');
  const battleship = testGB.fleet.find((ship) => ship.name === 'battleship');
  const cruiser = testGB.fleet.find((ship) => ship.name === 'cruiser');
  const submarine = testGB.fleet.find((ship) => ship.name === 'submarine');
  const destroier = testGB.fleet.find((ship) => ship.name === 'destroier');

  testGB.placeShip(0, 0, carrier, 'horizontal');
  testGB.placeShip(1, 0, battleship, 'horizontal');
  testGB.placeShip(2, 0, cruiser, 'horizontal');
  testGB.placeShip(3, 0, submarine, 'horizontal');
  testGB.placeShip(4, 0, destroier, 'horizontal');

  testGB.receiveAttack(0, 0);
  testGB.receiveAttack(0, 1);
  testGB.receiveAttack(0, 2);
  testGB.receiveAttack(0, 3);
  testGB.receiveAttack(0, 4);

  testGB.receiveAttack(1, 0);
  testGB.receiveAttack(1, 1);
  testGB.receiveAttack(1, 2);
  testGB.receiveAttack(1, 3);

  testGB.receiveAttack(2, 0);
  testGB.receiveAttack(2, 1);
  testGB.receiveAttack(2, 2);

  testGB.receiveAttack(3, 0);
  testGB.receiveAttack(3, 1);
  testGB.receiveAttack(3, 2);

  testGB.receiveAttack(4, 0);
  testGB.receiveAttack(4, 1);

  expect(testGB.areAllShipsSunk()).toEqual(true);
});
