class Ship {
  constructor(name = null, length) {
    this.name = name;
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }
}

const shipFunctions = {
  hit() {
    this.hits += 1;
    this.isSunk();
  },
  isSunk() {
    if (this.hits >= this.length) this.sunk = true;
    return this.sunk;
  },
};

Object.assign(Ship.prototype, shipFunctions);

export default Ship;
