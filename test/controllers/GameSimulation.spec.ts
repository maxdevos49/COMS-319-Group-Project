import { expect } from "chai";
import v1Gen from "uuid/v1";

import { GameSimulation } from '../../src/controllers/simulation/GameSimulation';
import { PlayerMoveUpdate, PlayerMoveDirection } from "../../src/public/javascript/models/game/PlayerMoveUpdate";
import { PlayerMoveUpdateQueue } from "../../src/public/javascript/data-structures/PlayerMoveUpdateQueue";
import { Player } from "../../src/controllers/simulation/objects/Player";

describe('GameSimulation', () => {
  it('should initialize a world', () => {
    const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
    const simulation: GameSimulation = new GameSimulation(updateQueue);
    expect(simulation).to.exist;
  });

  it('should extract a move from the queue for each player during a physics frame', () => {
    const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
    const simulation: GameSimulation = new GameSimulation(updateQueue);
    simulation.addPlayer("1");
    simulation.addPlayer("2");
    const player1Update: PlayerMoveUpdate = new PlayerMoveUpdate("1", 0, 1, true, PlayerMoveDirection.Down, false);
    const player2Update: PlayerMoveUpdate = new PlayerMoveUpdate("2", 0, 1, true, PlayerMoveDirection.Down, false);
    updateQueue.addPlayerMoveUpdate(player1Update);
    updateQueue.addPlayerMoveUpdate(player2Update);
    simulation.nextFrame();
    simulation.nextFrame();

    expect(updateQueue.size()).to.equal(0);
  });

  it('should update the frame count after performing a physics frame', () => {
    const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
    const simulation: GameSimulation = new GameSimulation(updateQueue);
    simulation.nextFrame();

    expect(simulation.getFrame()).to.equal(1);
  });

  describe('#addPlayer()', () => {
    it('should add a player to the simulation', function() {
      const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
      const simulation: GameSimulation = new GameSimulation(updateQueue);

      // the size of the players list should increase by 1
      const originalSize: number = simulation.objects.size;
      simulation.addPlayer(v1Gen());
      const newSize: number = simulation.objects.size;
      expect(newSize).to.equal(originalSize + 1);
    });
  });

  describe('#updateMove()', () => {
    it('should apply move updates to a player', () => {
      const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
      const simulation: GameSimulation = new GameSimulation(updateQueue);
      const id: string = v1Gen();
      simulation.addPlayer(id);

      const player: Player = simulation.objects.get(id) as Player;

      // The player should be in its default position at first.
      expect(player.getBody().GetAngle()).to.equal(0);
      expect(player.getBody().GetPosition().x).to.equal(0);
      expect(player.getBody().GetPosition().y).to.equal(0);

      // Apply a move update.
      let move: PlayerMoveUpdate = new PlayerMoveUpdate(id, 0, 1, true, PlayerMoveDirection.Up, false);
      simulation.updateMove(move);
      // Simulate 1 second in the simulation.
      for (let i = 0; i < 30; i++) {
        simulation.nextFrame();
      }

      expect(player.getBody().GetAngle()).to.equal(1);
      expect(player.getBody().GetPosition().x).to.equal(0);
      expect(player.getBody().GetPosition().y).to.be.closeTo(-Player.playerSpeed, 0.0001);

      // Apply a second move.
      move = new PlayerMoveUpdate(id, 1, 0, false, PlayerMoveDirection.UpLeft, false);
      simulation.updateMove(move);
      for (let i = 0; i < 30; i++) {
        simulation.nextFrame();
      }

      expect(player.getBody().GetAngle()).to.equal(1);
      // -7.071067811865472 (actual) is close enough to -7.071067811865475 (expected)
      expect(player.getBody().GetPosition().x).to.be.approximately(-1 * Player.playerSpeed / Math.sqrt(2), 0.00001);
      expect(player.getBody().GetPosition().y).to.be.approximately(-1 * (Player.playerSpeed + Player.playerSpeed / Math.sqrt(2)), 0.00001);
    });

    it('should apply a default move if it receives no move update', () => {
      const updateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(30, 10);
      const simulation: GameSimulation = new GameSimulation(updateQueue);
      const id: string = v1Gen();
      simulation.addPlayer(id);

      const player: Player = simulation.objects.get(id) as Player;

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
