import {expect} from "chai";
import { b2Vec2 } from "../../lib/box2d-physics-engine/Common/b2Math";
import { b2World } from "../../lib/box2d-physics-engine/Dynamics/b2World";
import { Bullet } from "../../src/controllers/simulation/objects/Bullet";
import { BulletPositionUpdate } from "../../src/public/javascript/models/game/objects/BulletPositionUpdate";
import { BulletObjectDescription } from "../../src/public/javascript/models/game/objects/BulletObjectDescription";
import { GameSimulation } from "../../src/controllers/simulation/GameSimulation";
import { PlayerMoveUpdateQueue } from "../../src/public/javascript/data-structures/PlayerMoveUpdateQueue";

describe("Simulation Bullet Object", () => {
	let simulation: GameSimulation;
	let bullet: Bullet;
	let otherBullet: Bullet;

	beforeEach(() => {
		simulation = new GameSimulation(new PlayerMoveUpdateQueue(1));
		bullet = new Bullet(simulation, "testid1", "testownerid1");
		otherBullet = new Bullet(simulation, "testid2", "testownerid2", 4, 5, 1, 10);
		simulation.addGameObject(bullet);
		simulation.addGameObject(otherBullet);
		bullet.killSpeed = 99;
		bullet.body.SetLinearVelocity({x: 100, y: 0});
		otherBullet.body.SetLinearVelocity({x: 1, y: 0});
	});

	it("Should create bullet at 0,0", () => {
		expect(bullet.body.GetPosition()).to.have.property("x").that.equals(0);
		expect(bullet.body.GetPosition()).to.have.property("y").that.equals(0);
	});
	it("Should reference the given id and owner id", () => {
		expect(bullet.ownerId).to.equal("testownerid1");
		expect(otherBullet.ownerId).to.equal("testownerid2");
	});
	it("Should return a position update that has the given frame", () => {
		expect(bullet.getPositionUpdate(10)).to.have.property("frame").that.equals(10);
	});
	it("Should return a position update that matches the position of the bullet", () => {
		let positionUpdate: BulletPositionUpdate = bullet.getPositionUpdate(2) as BulletPositionUpdate;
		expect(positionUpdate).to.have.property("x").that.equals(0);
		expect(positionUpdate).to.have.property("y").that.equals(0);
	});
	it("Changes to the body should be reflected in the position update", () => {
		// Changes to other bullet performed in the before statement
		let positionUpdate: BulletPositionUpdate = otherBullet.getPositionUpdate(4) as BulletPositionUpdate;
		expect(positionUpdate).to.have.property("x").that.equals(4);
		expect(positionUpdate).to.have.property("y").that.equals(5);
	});
	it("Should return a new object description that matches the bullet", () => {
		let description: BulletObjectDescription = otherBullet.getAsNewObject() as BulletObjectDescription;
		expect(description).to.have.property("id").that.equals("testid2");
		expect(description).to.have.property("ownerId").that.equals("testownerid2");
		expect(description).to.have.property("x").that.equals(4);
		expect(description).to.have.property("y").that.equals(5);
		expect(description).to.have.property("angle").that.equals(1);
	});
	it("Should destroy itself when its velocity is below the kill speed", () => {
		expect(simulation.objects.get("testid2")).to.not.be.undefined;
		expect(simulation.objects.get("testid1")).to.not.be.undefined;
		simulation.nextFrame();
		expect(simulation.objects.get("testid2")).to.be.undefined;
		expect(simulation.objects.get("testid1")).to.not.be.undefined;
	});
});