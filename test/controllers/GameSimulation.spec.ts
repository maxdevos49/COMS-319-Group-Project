import { expect } from "chai";
import v1Gen from "uuid/v1";

import { GameSimulation } from '../../src/controllers/GameSimulation';
import { PlayerMoveUpdate, PlayerMoveDirection } from "../../src/public/javascript/models/game/PlayerMoveUpdate";
import { Player } from "../../src/controllers/Player";

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
    const simulation: GameSimulation = new GameSimulation();
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
    // TODO
  });
});
