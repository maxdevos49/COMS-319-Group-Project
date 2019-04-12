import { GameObject } from "./GameObject";
import { b2Body, b2BodyDef, b2BodyType } from "../../../../lib/box2d-physics-engine/Dynamics/b2Body";
import { BulletObjectDescription } from "../../../public/javascript/models/game/objects/BulletObjectDescription";
import { GameObjectType, IObjectDescription } from "../../../public/javascript/models/game/objects/IObjectDescription";
import { BulletPositionUpdate } from "../../../public/javascript/models/game/objects/BulletPositionUpdate";
import { IPositionUpdate } from "../../../public/javascript/models/game/objects/IPositionUpdate";
import { b2Fixture, b2FixtureDef } from "../../../../lib/box2d-physics-engine/Dynamics/b2Fixture";
import { b2CircleShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2CircleShape";
import { weaponCollisionFilter } from "../CollisionFilters";
import { GameSimulation } from "../GameSimulation";

export class Bullet extends GameObject {
	public id: string;
	public type: GameObjectType;

	/**
	 * The id of the game object that owns this bullet (normally the player that shot it)
	 */
	public ownerId: string;
	/**
	 * The body that represents the collision space of the bullet
	 */
	public body: b2Body;
	/**
	 * The fixture for the collision box of the bullet
	 */
	public fixture: b2Fixture;

	/**
	 * Constructs a new bullet object for the given simulation
	 * @param simulation The simulation this bullet belongs to
	 * @param id The id of the the bullet
	 * @param ownerId The id of the gameobject that owns the bullet
	 * @param x The x coordinate of the bullet, default 0
	 * @param y The y coordinate of the bullet, default 0
	 * @param angle The angle of the bullet, default 0
	 */
	constructor(simulation: GameSimulation, id: string, ownerId: string, x: number = 0, y: number = 0, angle: number = 0) {
		super(id, GameObjectType.Bullet, simulation);
		this.ownerId = ownerId;

		// Create a dynamic body (fully simulated) the represents the bullet
		const bodyDef: b2BodyDef = new b2BodyDef();
		bodyDef.userData = id;
		bodyDef.type = b2BodyType.b2_dynamicBody;
		bodyDef.position.Set(x,y);
		bodyDef.angle = angle;
		bodyDef.bullet = true;
		this.body = this.simulation.world.CreateBody(bodyDef);

		// Create the collision fixture for the bullet
		const fixtureDef: b2FixtureDef = new b2FixtureDef();
		fixtureDef.userData = id;
		fixtureDef.shape = new b2CircleShape(.05);
		fixtureDef.filter.Copy(weaponCollisionFilter);
		fixtureDef.density = 0;
		this.fixture = this.body.CreateFixture(fixtureDef);
	}

	public destroy(): void {
		this.simulation.world.DestroyBody(this.body);
		this.simulation.removeGameObject(this.id);
	}

	public getAsNewObject(): IObjectDescription {
		return new BulletObjectDescription(
			this.id,
			this.ownerId,
			this.body.GetPosition().x,
			this.body.GetPosition().y,
			this.body.GetAngle()
		);
	}

	public getPositionUpdate(frame: number): IPositionUpdate {
		return new BulletPositionUpdate(
			this.id,
			frame,
			this.body.GetPosition().x,
			this.body.GetPosition().y
		);
	}

	public collideWith(object: IObjectDescription): void {
		this.destroy();
	}
}