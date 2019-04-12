import { IGameObject } from "./IGameObject";
import { b2World } from "../../../../lib/box2d-physics-engine/Dynamics/b2World";
import { b2Body, b2BodyDef, b2BodyType } from "../../../../lib/box2d-physics-engine/Dynamics/b2Body";
import { BulletObjectDescription } from "../../../public/javascript/models/game/objects/BulletObjectDescription";
import { IObjectDescription } from "../../../public/javascript/models/game/objects/IObjectDescription";
import { BulletPositionUpdate } from "../../../public/javascript/models/game/objects/BulletPositionUpdate";
import { IPositionUpdate } from "../../../public/javascript/models/game/objects/IPositionUpdate";

export class Bullet implements IGameObject {
	public static readonly BULLET_SPEED: number = 30;

	public id: string;
	/**
	 * The id of the game object that owns this bullet (normally the player that shot it)
	 */
	public ownerId: string;
	/**
	 * The body that represents the collision space of the bullet
	 */
	public body: b2Body;

	constructor(id: string, ownerId: string, world: b2World) {
		this.id = id;
		this.ownerId = ownerId;

		// Create a dynamic body (fully simulated) the represents the bullet
		const bodyDef: b2BodyDef = new b2BodyDef();
		bodyDef.type = b2BodyType.b2_dynamicBody;
		bodyDef.position.Set(0,0);
		bodyDef.bullet = true;
		this.body = world.CreateBody(bodyDef);
	}

	getAsNewObject(): IObjectDescription {
		return new BulletObjectDescription(this.id, this.ownerId, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
	}

	getPositionUpdate(frame: number): IPositionUpdate {
		return new BulletPositionUpdate(this.id, frame, this.body.GetPosition().x, this.body.GetPosition().y);
	}

}