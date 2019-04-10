import {
	b2Body,
	b2BodyDef,
	b2BodyType,
	b2World,
	b2FixtureDef,
	b2CircleShape,
} from "../../../../lib/box2d-physics-engine/Box2D";
import {IPositionUpdate} from "../../../public/javascript/models/game/objects/IPositionUpdate";
import {
	PlayerActionState,
	PlayerPositionUpdate
} from "../../../public/javascript/models/game/objects/PlayerPositionUpdate";
import {IGameObject} from "./IGameObject";
import {IObjectDescription, NewObjectType} from "../../../public/javascript/models/game/objects/IObjectDescription";
import {PlayerObjectDescription} from "../../../public/javascript/models/game/objects/PlayerObjectDescription";

/**
 * A player in the game. Contains the physics body.
 */
export class Player implements IGameObject{
	/**
	 * The UUID of the player. This should correspond with the UUID assigned to
	 * a particular connection.
	 */
	public id: string;

	/**
	 * The Box2D physics body used for the physics simulation.
	 */
	private body: b2Body;

	constructor(id: string, world: b2World) {
		this.id = id;

		// The player is a dynamic body, which means that it is fully simulated,
		// moves in response to forces, and has a finite, non-zero mass.
		const bodyDef: b2BodyDef = new b2BodyDef();
		bodyDef.type = b2BodyType.b2_dynamicBody;
		bodyDef.position.Set(0, 0);
		this.body = world.CreateBody(bodyDef);

		// Fixtures are carried around on the bodies. They define a body's
		// geometry and mass. These are important for collisions.
		const fixture: b2FixtureDef = new b2FixtureDef();
		fixture.shape = new b2CircleShape(50); // 50 m radius
		// fixture.density = 1.0; // 1.0 kg/m^3
		this.body.CreateFixture(fixture, 50.0); // 1.0 kg/m^3 density
	}

	public getId(): string {
		return this.id;
	}

	public getBody(): b2Body {
		return this.body;
	}

	/**
	 * Gets the PlayerPositionUpdate that describes the current state of the player
	 * @param frame The frame for the position update to be made
	 */
	public getPositionUpdate(frame: number): IPositionUpdate {
		return new PlayerPositionUpdate(
			frame,
			this.id,
			this.body.GetPosition().x,
			this.body.GetPosition().y,
			this.body.GetAngle(),
			PlayerActionState.Still
		);
	}

	/**
	 * Gets the NewPlayerObject that describes the state of the player. This can be sent to initialize the clients
	 * knowledge of this player
	 */
	public getAsNewObject(): IObjectDescription {
		return new PlayerObjectDescription(this.id, NewObjectType.Player, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
	}
}
