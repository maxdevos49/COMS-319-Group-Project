import {b2Body, b2BodyDef, b2BodyType, b2World,} from "../../../../lib/box2d-physics-engine/Box2D";
import {PositionUpdate} from "../../../public/javascript/models/game/objects/PositionUpdate";
import {
	PlayerActionState,
	PlayerPositionUpdate
} from "../../../public/javascript/models/game/objects/PlayerPositionUpdate";
import {GameObject} from "./GameObject";
import {ObjectDescription, NewObjectType} from "../../../public/javascript/models/game/objects/ObjectDescription";
import {PlayerObjectDescription} from "../../../public/javascript/models/game/objects/PlayerObjectDescription";

/**
 * A player in the game. Contains the physics body.
 */
export class Player implements GameObject{
	/**
	 * The UUID of the player. This should correspond with the UUID assigned to
	 * a particular connection.
	 */
	private id: string;

	/**
	 * The Box2D physics body used for the physics simulation.
	 */
	private body: b2Body;

	constructor(id: string, world: b2World) {
		this.id = id;

		// define the dynamic body
		const bodyDef: b2BodyDef = new b2BodyDef();
		bodyDef.type = b2BodyType.b2_dynamicBody;
		bodyDef.position.Set(0, 0);
		this.body = world.CreateBody(bodyDef);
	}

	getId(): string {
		return this.id;
	}

	getBody(): b2Body {
		return this.body;
	}

	/**
	 * Gets the PlayerPositionUpdate that describes the current state of the player
	 * @param frame The frame for the position update to be made
	 */
	public getPositionUpdate(frame: number): PositionUpdate {
		return new PlayerPositionUpdate(frame, this.id, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle(), PlayerActionState.Still);
	}

	/**
	 * Gets the NewPlayerObject that describes the state of the player. This can be sent to initialize the clients
	 * knowledge of this player
	 */
	public getAsNewObject(): ObjectDescription {
		return new PlayerObjectDescription(this.id, NewObjectType.Player, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
	}
}
