import { expect } from "chai";
import { Player } from "../../src/game/simulation/objects/Player";
import { GameSimulation } from "../../src/game/simulation/GameSimulation";
import { PlayerMoveUpdateQueue } from "../../src/public/javascript/game/data-structures/PlayerMoveUpdateQueue";

describe("Simulation Player Object", () => {
    let simulation: GameSimulation;
    let player: Player;
    let otherPlayer: Player;

    beforeEach(() => {
    	simulation = new GameSimulation(new PlayerMoveUpdateQueue(1))
        player = new Player(simulation, "testid1");
        otherPlayer = new Player(simulation,"testid2");
        simulation.nextFrame();
    });

    it("Should create player located at 0,0", () => {
        expect(player.body.GetPosition()).to.have.property("x").that.equals(0);
        expect(player.body.GetPosition()).to.have.property("y").that.equals(0);
    });
    it("Should create a player with 100 health points", () => {
        expect(player.health).to.equal(100);
    });
    it("Should lose health upon taking damage", () => {
        player.takeDamage(75);
        expect(player.health).to.equal(25);
    });
    it("Should return PostionUpdates with the given frame number", () => {
        expect(player.getPositionUpdate(0)).to.have.property("frame").that.equals(0);
        expect(player.getPositionUpdate(100)).to.have.property("frame").that.equals(100);
    });
    it("Should return PositionUpdates that match the position of the player", () => {
       expect(player.getPositionUpdate(0)).to.have.property("x").that.equals(0);
       expect(player.getPositionUpdate(0)).to.have.property("y").that.equals(0);
       player.body.SetPosition({x: 20, y: 20});
       expect(player.getPositionUpdate(0)).to.have.property("x").that.equals(20);
       expect(player.getPositionUpdate(0)).to.have.property("y").that.equals(20);
    });
    it('Should detect when its shape collides with another shape', () => {
        // The second player should spawn in the same location as the first
        // player. Therefore, there should be a collision.
        expect(player.body.GetContactList()).to.exist;
    });
});
