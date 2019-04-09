import {
	b2Body,
	b2BodyDef,
	b2BodyType,
	b2World,
	b2FixtureDef,
	b2PolygonShape
} from "../../../../lib/box2d-physics-engine/Box2D";
import {IPositionUpdate} from "../../../public/javascript/models/game/objects/IPositionUpdate";
import {
	PlayerActionState,
	PlayerPositionUpdate
} from "../../../public/javascript/models/game/objects/PlayerPositionUpdate";
import {IGameObject} from "./IGameObject";
import {IObjectDescription, NewObjectType} from "../../../public/javascript/models/game/objects/IObjectDescription";
import {PlayerObjectDescription} from "../../../public/javascript/models/game/objects/PlayerObjectDescription";

const PLAYER: number = 0x0001;

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

		// define the dynamic body
		const bodyDef: b2BodyDef = new b2BodyDef();
		bodyDef.type = b2BodyType.b2_dynamicBody;
		bodyDef.position.Set(0, 0);
		this.body = world.CreateBody(bodyDef);

		// create a fixture which will allow us to attach a shape to the body
		const fixture: b2FixtureDef = new b2FixtureDef();
		fixture.shape = new b2PolygonShape().SetAsBox(50, 50);
		fixture.density = 1;
		fixture.filter.categoryBits = PLAYER;
		fixture.filter.maskBits = -1; // collide with everything
		this.body.CreateFixture(fixture, 1);
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
