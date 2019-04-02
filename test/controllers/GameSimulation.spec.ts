import { expect } from "chai";
import v1Gen from "uuid/v1";

import { GameSimulation } from '../../src/controllers/GameSimulation';
import { PlayerMoveUpdate, PlayerMoveDirection } from "../../src/public/javascript/models/game/PlayerMoveUpdate";
import { PlayerMoveUpdateQueue } from "../../src/public/javascript/data-structures/PlayerMoveUpdateQueue";
import { Player } from "../../src/controllers/Player";

describe('GameSimulation', () => {
  it('should initialize a world', () => {
    const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
    const simulation: GameSimulation = new GameSimulation(updateQueue);
    expect(simulation).to.exist;
  });

  it('should process physics equations 30 times per second', () => {
    const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
    const simulation: GameSimulation = new GameSimulation(updateQueue);
    expect(simulation).to.have.property("timeStep").that.equals(1/30);
  });

  describe('#addPlayer()', () => {
    it('should add a player to the simulation', function() {
      const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
      const simulation: GameSimulation = new GameSimulation(updateQueue);

      // the size of the players list should increase by 1
      const originalSize: number = simulation.getPlayers().length;
      simulation.addPlayer(v1Gen());
      const newSize: number = simulation.getPlayers().length;
      expect(newSize).to.equal(originalSize + 1);
    });
  });

  describe('#updateMove()', () => {
    it('should apply a move update to a player', () => {
      const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
      const simulation: GameSimulation = new GameSimulation(updateQueue);
      const id: string = v1Gen();
      simulation.addPlayer(id);

      const player: Player = simulation.getPlayers()[0];

      // the player should be in its default position at first
      expect(player.getBody().GetAngle()).to.equal(0);
      expect(player.getBody().GetPosition().x).to.equal(0);
      expect(player.getBody().GetPosition().y).to.equal(0);

      // apply the move update
      let move: PlayerMoveUpdate = new PlayerMoveUpdate(id, 0, 1, true, PlayerMoveDirection.Up);
      simulation.updateMove(move);

      // the player should now be at (0, 1) and be turned 1 rad
      expect(player.getBody().GetAngle()).to.equal(1);
      expect(player.getBody().GetPosition().x).to.equal(0);
      expect(player.getBody().GetPosition().y).to.equal(1);

      // simulate a second move
      move = new PlayerMoveUpdate(id, 1, 0, false, PlayerMoveDirection.LeftUp);
      simulation.updateMove(move);

      expect(player.getBody().GetAngle()).to.equal(1);
      expect(player.getBody().GetPosition().x).to.equal(-1);
      expect(player.getBody().GetPosition().y).to.equal(2);
    });

    it('should apply a default move if it receives no move update', () => {
      const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
      const simulation: GameSimulation = new GameSimulation(updateQueue);
      const id: string = v1Gen();
      simulation.addPlayer(id);

      const player: Player = simulation.getPlayers()[0];

      // the player should be in its default position at first
      expect(player.getBody().GetAngle()).to.equal(0);
      expect(player.getBody().GetPosition().x).to.equal(0);
      expect(player.getBody().GetPosition().y).to.equal(0);

      // apply the move update
      let move: null = null;
      simulation.updateMove(move);

      // the player should not move
      expect(player.getBody().GetAngle()).to.equal(0);
      expect(player.getBody().GetPosition().x).to.equal(0);
      expect(player.getBody().GetPosition().y).to.equal(0);
    });
  })
});
