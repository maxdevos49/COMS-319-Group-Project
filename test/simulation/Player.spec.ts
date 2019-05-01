import { expect } from "chai";
import { Player } from "../../src/game/simulation/objects/Player";
import { GameSimulation } from "../../src/game/simulation/GameSimulation";
import { PlayerMoveUpdateQueue } from "../../src/public/javascript/game/data-structures/PlayerMoveUpdateQueue";
import { Bullet } from "../../src/game/simulation/objects/Bullet";

describe("Simulation Player Object", () => {
    let simulation: GameSimulation;
    let player: Player;
    let otherPlayer: Player;

    beforeEach(() => {
        simulation = new GameSimulation(new PlayerMoveUpdateQueue(1))
        player = new Player(simulation, "testid1");
        otherPlayer = new Player(simulation,"testid2");
        // I am adding the players to the simulation manually instead of
        // using the addPlayer() method because it requires the smallest
        // change in code to make the tests pass. We could also return a
        // reference to the newly created Player from the addPlayer() method.
        simulation.addGameObject(player);
        simulation.addGameObject(otherPlayer);
        simulation.nextFrame();
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
       expect(player.getPositionUpdate(0)).to.have.property("x").that.equals(player.body.GetPosition().x);
       expect(player.getPositionUpdate(0)).to.have.property("y").that.equals(player.body.GetPosition().y);
       player.body.SetPosition({x: 20, y: 20});
       expect(player.getPositionUpdate(0)).to.have.property("x").that.equals(20);
       expect(player.getPositionUpdate(0)).to.have.property("y").that.equals(20);
    });
    it("Should detect when its shape collides with another shape", () => {
        // The second player should spawn in the same location as the first
        // player. Therefore, there should be a collision.
        expect(player.body.GetContactList()).to.exist;
    });
    it("Should lose health upon colliding with a bullet", () => {
        const bullet = new Bullet(simulation, "id1", "ownerId", 0, 0, 0, 1);
        player.collideWith(bullet);
        expect(player.health).to.equal(90);
    });
    it("Should increment the other player's kill count when killed", () => {
        expect(otherPlayer.stats.enemiesKilled).to.equal(0);
        // Quickly decrease HP to 10 so that the bullet kills
        player.takeDamage(90);
        const bullet = new Bullet(simulation, "id1", "testid2", 0, 0, 0, 1);
        player.collideWith(bullet);
        expect(otherPlayer.stats.enemiesKilled).to.equal(1);
    });
    it("Should not lose health upon colliding with another player", () => {
        player.collideWith(otherPlayer);
        expect(player.health).to.equal(100);
    });
    it("Should create an event upon losing health", () => {
        const bullet = new Bullet(simulation, "id1", "ownerId", 0, 0, 0, 1);
        player.collideWith(bullet);
        expect(simulation.events.length).to.equal(1);
    });
    it("Should destroy itself when health reaches or goes below zero", () => {
        let original: number = simulation.world.GetBodyCount();
        player.takeDamage(100);
        expect(simulation.world.GetBodyCount()).to.equal(original - 1);
    });
    it("Should record the number of seconds spent in the game when it dies", () => {
        player.takeDamage(100);
        expect(player.stats.secondsInGame).to.equal(simulation.frame / 30);
    });
    it("Should create an event upon losing health", () => {
        const bullet = new Bullet(simulation, "id1", "ownerId", 0, 0, 0, 1);
        let originalEventLength: number = simulation.events.length;
        player.collideWith(bullet);
        expect(simulation.events.length).to.equal(originalEventLength + 1);
    });
});
