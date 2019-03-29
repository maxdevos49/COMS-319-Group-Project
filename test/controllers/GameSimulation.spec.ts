import { expect } from "chai";

import { GameSimulation } from '../../src/controllers/GameSimulation';

describe('GameSimulation', () => {
  it('should initialize a world', () => {
    const simulation: GameSimulation = new GameSimulation();
    expect(simulation).to.have.property("world");
  });

  describe('#addPlayer()', function() {
    it('should add a player to the simulation', function() {
      const simulation: GameSimulation = new GameSimulation();

      // the size of the players list should increase by 1
      const originalSize: number = simulation.getPlayers().length;
      simulation.addPlayer();
      const newSize: number = simulation.getPlayers().length;
      expect(newSize).to.equal(originalSize + 1);
    });
  });
});
