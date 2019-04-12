import {
	b2Body,
	b2BodyDef,
	b2BodyType,
	b2CircleShape,
	b2Fixture,
	b2FixtureDef,
	b2PolygonShape, b2Shape,
	b2World, XY,
} from "../../../../lib/box2d-physics-engine/Box2D";
import { IPositionUpdate } from "../../../public/javascript/models/game/objects/IPositionUpdate";
import {
	PlayerActionState,
	PlayerPositionUpdate
} from "../../../public/javascript/models/game/objects/PlayerPositionUpdate";
import { GameObject } from "./GameObject";
import { GameObjectType, IObjectDescription } from "../../../public/javascript/models/game/objects/IObjectDescription";
import { PlayerObjectDescription } from "../../../public/javascript/models/game/objects/PlayerObjectDescription";
import { hitboxCollisionFilter, worldCollisionFilter } from "../CollisionFilters";
import { GameSimulation } from "../GameSimulation";
import { PlayerMoveDirection, PlayerMoveUpdate } from "../../../public/javascript/models/game/PlayerMoveUpdate";
import { Bullet } from "./Bullet";
import v1Gen from "uuid/v1";

/**
 * A player in the game. Contains the physics body.
 */
export class Player extends GameObject{
	/**
	 * The cool-down between shooting in frames
	 */
	public static SHOOT_COOLDOWN: number = 5;
	/**
	 * Velocity in meters per second that the players should move.
	 */
	public static playerSpeed: number = 3;
	/**
	 * The hit box for player weapon collisions
	 */
	public static playerHitboxShape: b2PolygonShape = new b2PolygonShape().SetAsBox(0.5, 0.5);

	/**
	 * The Box2D physics body used for the physics simulation.
	 */
	public body: b2Body;
	/**
	 * The collision fixture used to compute player-world collisions
	 */
	public playerCollisionFixture: b2Fixture;
	/**
	 * The collision fixture used to compute hits on the player (more accurate)
	 */
	public playerHitboxFixture: b2Fixture;
	/**
	 * The frame which this player last shot
	 */
	public lastShotFrame: number;

	constructor(simulation: GameSimulation, id: string) {
		super(id, GameObjectType.Player, simulation)
		this.id = id;
		this.type = GameObjectType.Player;

		// Assume frame 0 because this variable is only used to restrict shooting speed
		this.lastShotFrame = 0;

		// The player is a dynamic body, which means that it is fully simulated,
		// moves in response to forces, and has a finite, non-zero mass.
		const bodyDef: b2BodyDef = new b2BodyDef();
		bodyDef.type = b2BodyType.b2_dynamicBody;
		bodyDef.position.Set(0, 0);
		this.body = this.simulation.world.CreateBody(bodyDef);

		// Fixtures are carried around on the bodies. They define a body's
		// geometry and mass. These are important for collisions.

		// Create fixture for the player colliding with the world
		const playerCollisionFixtureDef: b2FixtureDef = new b2FixtureDef();
		playerCollisionFixtureDef.userData = id;
		playerCollisionFixtureDef.shape = new b2CircleShape(.5); // 50 m radius
		playerCollisionFixtureDef.filter.Copy(worldCollisionFilter);
		// fixture.density = 1.0; // 1.0 kg/m^3
		this.playerCollisionFixture = this.body.CreateFixture(playerCollisionFixtureDef, 4.0); // 1.0 kg/m^3 density
		// Create fixture for the player colliding with weapons
		const playerHitboxFixtureDef: b2FixtureDef = new b2FixtureDef();
		playerHitboxFixtureDef.userData = id;
		playerHitboxFixtureDef.shape = Player.playerHitboxShape;
		playerHitboxFixtureDef.filter.Copy(hitboxCollisionFilter);
		this.playerCollisionFixture = this.body.CreateFixture(playerHitboxFixtureDef, 4.0);
	}

	public destroy(): void {
		this.simulation.world.DestroyBody(this.body);
		this.simulation.removeGameObject(this.id);
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

	public applyPlayerMoveUpdate(move: PlayerMoveUpdate) {
		if (move.updateFacing) {
			this.getBody().SetAngle(move.facing);
		}
		this.getBody().SetLinearVelocity(Player.getVelocityVector(move.moveDirection));

		// If the player wants to shoot
		if (move.attemptShoot) {
			// Attempt to shoot, might be stopped by the cool down
			if (this.attemptShoot(this.simulation.frame)) {
				let x: number = this.body.GetPosition().x + Math.cos(this.body.GetAngle()) * (Player.playerHitboxShape.m_radius + 0.6);
				let y: number = this.body.GetPosition().y + Math.sin(this.body.GetAngle()) * (Player.playerHitboxShape.m_radius + 0.6);
				let bullet: Bullet = new Bullet(this.simulation, v1Gen(), this.id, x, y, this.body.GetAngle());
				bullet.body.SetLinearVelocity({
					x: 15 * Math.cos(bullet.body.GetAngle()) + this.body.GetLinearVelocity().x,
					y: 15 * Math.sin(bullet.body.GetAngle()) + this.body.GetLinearVelocity().y
				});
				this.simulation.addGameObject(bullet);
			}
		}
	}

	/**
	 * Get the velocity for a desired change in position represented by
	 * Up, UpLeft, etc.
	 *
	 * @param {PlayerMoveDirection} direction - The direction the player wants to move.
	 * @return {XY} A velocity vector.
	 */
	private static getVelocityVector(direction: PlayerMoveDirection): XY {
		const velocity: XY = { x: 0, y: 0 };
		switch (direction) {
			case PlayerMoveDirection.Right:
				velocity.x = Player.playerSpeed;
				break;
			case PlayerMoveDirection.UpRight:
				velocity.x = Player.playerSpeed;
				velocity.y = -Player.playerSpeed;
				break;
			case PlayerMoveDirection.Up:
				velocity.y = -Player.playerSpeed;
				break;
			case PlayerMoveDirection.UpLeft:
				velocity.x = -Player.playerSpeed;
				velocity.y = -Player.playerSpeed;
				break;
			case PlayerMoveDirection.Left:
				velocity.x = -Player.playerSpeed;
				break;
			case PlayerMoveDirection.DownLeft:
				velocity.x = -Player.playerSpeed;
				velocity.y = Player.playerSpeed;
				break;
			case PlayerMoveDirection.Down:
				velocity.y = Player.playerSpeed;
				break;
			case PlayerMoveDirection.DownRight:
				velocity.x = Player.playerSpeed;
				velocity.y = Player.playerSpeed;
				break;
		}

		// If the player is moving diagonally, and X and Y components of the
		// velocity add together, which makes the player move faster diagonally
		// compared to moving only up/down/left/right. We divide the X and Y
		// components of the velocity by sqrt(2) to adjust for this.
		if (direction === PlayerMoveDirection.UpRight
			|| direction === PlayerMoveDirection.UpLeft
			|| direction === PlayerMoveDirection.DownLeft
			|| direction === PlayerMoveDirection.DownRight
		) {
			velocity.x = velocity.x / Math.sqrt(2);
			velocity.y = velocity.y / Math.sqrt(2);
		}

		return velocity;
	}
}
