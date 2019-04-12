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
import {IObjectDescription} from "../../../public/javascript/models/game/objects/IObjectDescription";
import {PlayerObjectDescription} from "../../../public/javascript/models/game/objects/PlayerObjectDescription";

/**
 * A player in the game. Contains the physics body.
 */
export class Player implements IGameObject{
	/**
	 * The cool-down between shooting in frames
	 */
	public static readonly SHOOT_COOLDOWN = 5;

	/**
	 * The UUID of the player. This should correspond with the UUID assigned to
	 * a particular connection.
	 */
	public id: string;
	/**
	 * The Box2D physics body used for the physics simulation.
	 */
	private body: b2Body;
	/**
	 * The frame which this player last shot
	 */
	public lastShotFrame: number;

	constructor(id: string, world: b2World) {
		this.id = id;
		// Assume frame 0 because this variable is only used to restrict shooting speed
		this.lastShotFrame = 0;

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
	 * Checks if this player can shoot at the given frame and if it can updates the player cool-down for shooting and
	 * returns true.
	 * @param frame The frame number to check if the player can shoot on
	 */
	public attemptShoot(frame: number): boolean {
		if ((frame - this.lastShotFrame) > Player.SHOOT_COOLDOWN) {
			this.lastShotFrame = frame;
			return true;
		}
		return false;
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
		return new PlayerObjectDescription(this.id, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
	}
}
