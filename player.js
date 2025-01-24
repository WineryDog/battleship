import Gameboard from './gameboard.js';

class Player {
  constructor(name = null) {
    this.name = name;
    this.playerGb = new Gameboard(10);
    this.playerNumber = null;
  }
}

export default Player;
