import { expect } from "chai";
import { b2Vec2 } from "../../lib/box2d-physics-engine/Common/b2Math";
import { b2World } from "../../lib/box2d-physics-engine/Dynamics/b2World";
import { Player } from "../../src/game/simulation/objects/Player";
import { PlayerPositionUpdate } from "../../src/public/javascript/game/models/game/objects/PlayerPositionUpdate";

describe("Simulation Player Object", () => {
    it("Should create player located at 0,0", () => {
        const gravity = new b2Vec2(0, 0);
        const world = new b2World(gravity);
        let player: Player = new Player("testid1", world);
        expect(player.getBody().GetPosition()).to.have.property("x").that.equals(0);
        expect(player.getBody().GetPosition()).to.have.property("y").that.equals(0);
    });
    it("Should return PostionUpdates with the given frame number", () => {
        const gravity = new b2Vec2(0, 0);
        const world = new b2World(gravity);
        let player: Player = new Player("testid1", world);
        expect(player.getPositionUpdate(0)).to.have.property("frame").that.equals(0);
        expect(player.getPositionUpdate(100)).to.have.property("frame").that.equals(100);
    });
    it("Should return PositionUpdates that match the position of the player", () => {
        const gravity = new b2Vec2(0, 0);
        const world = new b2World(gravity);
        let player: Player = new Player("testid1", world);
        expect(player.getPositionUpdate(0)).to.have.property("x").that.equals(0);
        expect(player.getPositionUpdate(0)).to.have.property("y").that.equals(0);
        player.getBody().SetPosition({ x: 20, y: 20 });
        expect(player.getPositionUpdate(0)).to.have.property("x").that.equals(20);
        expect(player.getPositionUpdate(0)).to.have.property("y").that.equals(20);
    });
});