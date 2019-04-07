import {expect} from "chai";
import {b2Vec2} from "../../lib/box2d-physics-engine/Common/b2Math";
import {b2World} from "../../lib/box2d-physics-engine/Dynamics/b2World";
import {Player} from "../../src/controllers/simulation/Player";

describe("Simulation Player Object", () => {
    let gravity: b2Vec2;
    let world: b2World;
    let player: Player;
    let otherPlayer: Player;

    before(() => {
        gravity = new b2Vec2(0, 0);
        world = new b2World(gravity);
        player = new Player("testid1", world);
        otherPlayer = new Player("testid2", world);
    });

    it("Should create player located at 0,0", () => {
        expect(player.getBody().GetPosition()).to.have.property("x").that.equals(0);
        expect(player.getBody().GetPosition()).to.have.property("y").that.equals(0);
    });
    it("Should return PostionUpdates with the given frame number", () => {
        expect(player.getPositionUpdate(0)).to.have.property("frame").that.equals(0);
        expect(player.getPositionUpdate(100)).to.have.property("frame").that.equals(100);
    });
    it("Should return PositionUpdates that match the position of the player", () => {
       expect(player.getPositionUpdate(0)).to.have.property("x").that.equals(0);
       expect(player.getPositionUpdate(0)).to.have.property("y").that.equals(0);
       player.getBody().SetPosition({x: 20, y: 20});
       expect(player.getPositionUpdate(0)).to.have.property("x").that.equals(20);
       expect(player.getPositionUpdate(0)).to.have.property("y").that.equals(20);
    });
    it('Should detect when its shape collides with another shape', () => {
        // The second player should spawn in the same location as the first
        // player. Therefore, there should be a collision.
        expect(player.getBody().GetContactList()).to.exist;
    });
});