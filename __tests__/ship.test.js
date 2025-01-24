import Ship from '../ship.js';

let testShip;

beforeEach(() => {
  testShip = new Ship('test', 3);
});

test('Ship should increment hits when is called', () => {
  testShip.hit();
  expect(testShip.hits).toBe(1);
});

test('Ship should not be sunk if hits <= length', () => {
  testShip.hit();
  expect(testShip.isSunk()).toBe(false);
});

test('Ship should be sunk if hits >= length', () => {
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});
