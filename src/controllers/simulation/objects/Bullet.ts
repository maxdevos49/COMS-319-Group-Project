import { IGameObject } from "./IGameObject";
import { b2World } from "../../../../lib/box2d-physics-engine/Dynamics/b2World";
import { b2Body, b2BodyDef, b2BodyType } from "../../../../lib/box2d-physics-engine/Dynamics/b2Body";
import { BulletObjectDescription } from "../../../public/javascript/models/game/objects/BulletObjectDescription";
import { GameObjectType, IObjectDescription } from "../../../public/javascript/models/game/objects/IObjectDescription";
import { BulletPositionUpdate } from "../../../public/javascript/models/game/objects/BulletPositionUpdate";
import { IPositionUpdate } from "../../../public/javascript/models/game/objects/IPositionUpdate";
import { b2Fixture, b2FixtureDef } from "../../../../lib/box2d-physics-engine/Dynamics/b2Fixture";
import { b2CircleShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2CircleShape";
import { weaponCollisionFilter } from "../CollisionFilters";

export class Bullet implements IGameObject {
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

	constructor(id: string, ownerId: string, world: b2World) {
		this.id = id;
		this.type = GameObjectType.Bullet;
		this.ownerId = ownerId;

		// Create a dynamic body (fully simulated) the represents the bullet
		const bodyDef: b2BodyDef = new b2BodyDef();
		bodyDef.userData = id;
		bodyDef.type = b2BodyType.b2_dynamicBody;
		bodyDef.position.Set(0,0);
		bodyDef.bullet = true;
		this.body = world.CreateBody(bodyDef);

		// Create the collision fixture for the bullet
		const fixtureDef: b2FixtureDef = new b2FixtureDef();
		fixtureDef.userData = id;
		fixtureDef.shape = new b2CircleShape(.05);
		fixtureDef.filter.Copy(weaponCollisionFilter);
		fixtureDef.density = 0;
		this.fixture = this.body.CreateFixture(fixtureDef);
	}

	deconstruct(world: b2World): void {
		world.DestroyBody(this.body);
	}

	getAsNewObject(): IObjectDescription {
		return new BulletObjectDescription(
			this.id,
			this.ownerId,
			this.body.GetPosition().x,
			this.body.GetPosition().y,
			this.body.GetAngle()
		);
	}

	getPositionUpdate(frame: number): IPositionUpdate {
		return new BulletPositionUpdate(
			this.id,
			frame,
			this.body.GetPosition().x,
			this.body.GetPosition().y
		);
	}
}