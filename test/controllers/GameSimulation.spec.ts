import { expect } from "chai";
import v1Gen from "uuid/v1";

import { GameSimulation } from '../../src/controllers/GameSimulation';

describe('GameSimulation', () => {
  it('should initialize a world', () => {
    const simulation: GameSimulation = new GameSimulation();
    expect(simulation).to.have.property("world");
  });

  it('should process 30 physics frames per second', () => {
    const simulation: GameSimulation = new GameSimulation();
    expect(simulation).to.have.property("fps").that.equals(30);
  });

  describe('#addPlayer()', function() {
    it('should add a player to the simulation', function() {
      const simulation: GameSimulation = new GameSimulation();

      // the size of the players list should increase by 1
      const originalSize: number = simulation.getPlayers().length;
      simulation.addPlayer(v1Gen());
      const newSize: number = simulation.getPlayers().length;
      expect(newSize).to.equal(originalSize + 1);
    });
  });

  it('should process a move update from the client', () => {
    // TODO
  });

  it('should apply a default move if it receives no move update', () => {
    // TODO
  });
});
