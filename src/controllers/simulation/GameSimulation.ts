import { b2Contact, b2ContactListener, b2Vec2, b2World, XY, } from "../../../lib/box2d-physics-engine/Box2D";

import { Player } from "./objects/Player";
import { PlayerMoveDirection, PlayerMoveUpdate } from "../../public/javascript/models/game/PlayerMoveUpdate";
import { PlayerMoveUpdateQueue } from "../../public/javascript/data-structures/PlayerMoveUpdateQueue";
import { IPositionUpdate } from "../../public/javascript/models/game/objects/IPositionUpdate";
import { TerrainMap } from "../../public/javascript/models/game/TerrainMap";
import { GameObjectType, IObjectDescription } from "../../public/javascript/models/game/objects/IObjectDescription";
import { TerrainGenerator } from "./TerrainGenerator";
import { GameObject } from "./objects/GameObject";
import { Bullet } from "./objects/Bullet";
import v1Gen from "uuid/v1";

// DEBUG: Write to the console when bodies contact each other
class ContactListener extends b2ContactListener {
	public BeginContact(contact: b2Contact): void {
		console.log('Contact detected on: ');
	}
	public EndContact(contact: b2Contact): void {
		console.log('Contact removed');
	}
}

/**
 * Simulation of the physical world of the game.
 */
export class GameSimulation {
	/**
	 * Starting point for a Box2D simulation.
	 */
	public world: b2World;

	/**
	 * The number of times per second tht Box2D will process physics equations.
	 */
	public static readonly timeStep: number = 1 / 30;

	/**
	 * Constraint solvers: larger values means better accuracy but worse
	 * performance.
	 */
	private static readonly velocityIterations: number = 6;
	private static readonly positionIterations: number = 2;

	/**
	 * The dimensions of the map in tiles
	 */
	private static readonly mapTileWidth = 200;
	private static readonly mapTileHeight = 200;

  /**
   * Velocity in meters per second that the players should move.
   */
  public playerSpeed: number;

	/**
	 * The current frame number of the simulation.
	 */
	public frame: number;

	/**
	 * List of objects (dynamic bodies) in the simulation.
	 * The Map makes it easier to update players by their ID.
	 */
	public objects: Map<string, GameObject>;
	/**
	 * The terrain map for this simulation, object represents all of parts of the game world that don't change
	 */
	public map: TerrainMap;
	/**
	 * A reference to the move queue in the game server.
	 */
	private moves: PlayerMoveUpdateQueue;
	/**
	 * An array containing the ids of new objects that now exist in the simulation
	 */
	private newObjectsIds: string[];
	/**
	 * An array containing the ids of the objects that have been deleted from the simulation
	 */
	private deletedObjectIds: string[];

	/**
	 * Construct a new simulation. The simulation starts running as soon as it
	 * is created unless the start parameter is false (it's true by default).
	 *
	 * @param {PlayerMoveUpdateQueue} moves - A queue of pending moves.
	 */
	constructor(moves: PlayerMoveUpdateQueue) {
		this.moves = moves;

		// Initialize the box2d world
		const gravity = new b2Vec2(0, 0);
		this.world = new b2World(gravity);

		// DEBUG: Need this to actually use the ContactListener class
		this.world.SetContactListener(new ContactListener());

		this.playerSpeed = 3;
		this.frame = 0;
		this.objects = new Map<string, Player>();
		this.newObjectsIds = [];
		this.deletedObjectIds = [];
		this.map = new TerrainMap(GameSimulation.mapTileWidth, GameSimulation.mapTileHeight, 0);
		TerrainGenerator.fillTerrain(this.map);
	}

	/**
	 * Advance to the next physics frame.
	 *
	 * @return {void}
	 */
	public nextFrame(): void {
		this.objects.forEach((object) => {
			const move = this.moves.popPlayerMoveUpdate(object.id);
			if (move != null) this.updateMove(move);

			// DEBUG: Information about the player and its body
			// if (this.frame % 40 == 0) {
			// 	const id = player.getId();
			// 	const x = player.getBody().GetPosition().x;
			// 	const y = player.getBody().GetPosition().y;
			// 	const angle = player.getBody().GetAngle();
			// 	console.log(`id: ${id}\tx: ${x}\ty: ${y}\tangle: ${angle}\n`);
			// }
		});
		this.moves.incrementFrame();
		this.world.Step(
			GameSimulation.timeStep,
			GameSimulation.velocityIterations,
			GameSimulation.positionIterations
		);

		// Check collisions
		let curContact: b2Contact = this.world.GetContactList();
		while (curContact != null) {
			if (!curContact.IsTouching()) {
				curContact = curContact.m_next;
				continue;
			}

			// IDs of objects stored as user data
			let ida: string = curContact.GetFixtureA().m_userData;
			let idb: string = curContact.GetFixtureB().m_userData;
			// Check that both objects exist in the map and retrieve them
			let objecta: GameObject = this.objects.get(ida);
			let objectb: GameObject = this.objects.get(idb);
			if (objecta && objectb) {
				objecta.collideWith(objectb);
				objectb.collideWith(objecta);
			}

			curContact = curContact.m_next;
		}

		this.frame++;
	}

	/**
	 * Generate a new player and add it to the world.
	 *
	 * @param {string} id - The UUID of the player.
	 */
	public addPlayer(id: string): void {
		const player: Player = new Player(this, id);
		this.objects.set(id, player);
		this.newObjectsIds.push(id);
	}

	/**
	 * Removes the game object that has the given simulation from this simulation. This will not remove this object
	 * from the world. Do this with the destroy method of the object
	 * @param id The id of the object to remove from the simulation
	 */
	public removeGameObject(id: string) {
		this.objects.delete(id);
		this.deletedObjectIds.push(id);
	}

	/**
	 * Process a move update from a client.
	 *
	 * @param {PlayerMoveUpdate} move - An object containing move information.
	 */
	public updateMove(move: PlayerMoveUpdate | null): void {
		if (move === null) {
			return;
		}
		let player: Player | undefined = this.objects.get(move.id) as Player;
		if (player !== undefined) {
			if (move.updateFacing) {
				player.getBody().SetAngle(move.facing);
			}
			player.getBody().SetLinearVelocity(this.getVelocityVector(move.moveDirection));

			// If the player wants to shoot
			if (move.attemptShoot) {
				// Attempt to shoot, might be stopped by the cool down
				if (player.attemptShoot(this.frame)) {
					let bullet: Bullet = new Bullet(this, v1Gen(), player.id);
					bullet.body.SetPosition({
						x: player.body.GetPosition().x + Math.cos(player.body.GetAngle()) * (player.playerCollisionFixture.GetShape().m_radius + bullet.fixture.GetShape().m_radius + 0.6),
						y: player.body.GetPosition().y + Math.sin(player.body.GetAngle()) * (player.playerCollisionFixture.GetShape().m_radius + bullet.fixture.GetShape().m_radius + 0.6),
					});
					bullet.body.SetAngle(player.getBody().GetAngle());
					bullet.body.SetLinearVelocity({
						x: 15 * Math.cos(bullet.body.GetAngle()) + player.getBody().GetLinearVelocity().x,
						y: 15 * Math.sin(bullet.body.GetAngle()) + player.getBody().GetLinearVelocity().y
					});
					this.newObjectsIds.push(bullet.id);
					this.objects.set(bullet.id, bullet);
				}
			}
		}
	}

	/**
	 * Get the current frame number.
	 *
	 * @return {number} The current frame number.
	 */
	public getFrame(): number {
		return this.frame;
	}

	/**
	 * Gets an array of position updates for every object that is in the simulation
	 *
	 * @return {PositionUpdate[]} An array of position updates.
	 */
	public getPositionUpdates(): IPositionUpdate[] {
		let updates: IPositionUpdate[] = [];
		this.objects.forEach((object: GameObject, id: string) => {
			updates.push(object.getPositionUpdate(this.frame))
		});
		return updates;
	}

	/**
	 * Maps all of the objects that are in the game now to an object description that describes it
	 */
	public getObjectDescriptions(): IObjectDescription[] {
		let descriptions: IObjectDescription[] = [];
		this.objects.forEach((object: GameObject, id: string) => {
			descriptions.push(object.getAsNewObject());
		});
		return descriptions;
	}

	/**
	 * Returns true if the simulation has created at least one new object since the last time popNewObjectDescriptions was called
	 */
	public hasNewObjectDescriptions(): boolean {
		return this.newObjectsIds.length !== 0;
	}
	/**
	 * Maps all of the new objects (since the last time this method was called) to an objects description that describes it
	 */
	public popNewObjectDescriptions(): IObjectDescription[] {
		// Get a new object description for every new object id. Filter out undefined objects just in case that objects
		// has been removed, since the simulation should not be expected to check the new object id array every time a object
		// is destroyed
		let newObjectsDescriptions: IObjectDescription[] = this.newObjectsIds.map((id: string) => this.objects.get(id))
			.filter((object: GameObject) => object !== undefined)
			.map((object: GameObject) => object.getAsNewObject());
		this.newObjectsIds = [];
		return newObjectsDescriptions;
	}

	/**
	 * Returns true if this simulation has any new deleted object ids since the last time they were popped
	 */
	public hasDeletedObjects(): boolean {
		return this.deletedObjectIds.length !== 0;
	}

	/**
	 * Pops all deleted ids from the internal array of deleted ids
	 */
	public popDeletedObjectIds(): string[] {
		let temp: string[] = this.deletedObjectIds;
		this.deletedObjectIds = [];
		return temp;
	}

	/**
	 * Get the velocity for a desired change in position represented by
	 * Up, UpLeft, etc.
	 *
	 * @param {PlayerMoveDirection} direction - The direction the player wants to move.
	 * @return {XY} A velocity vector.
	 */
	private getVelocityVector(direction: PlayerMoveDirection): XY {
		const velocity: XY = { x: 0, y: 0 };
		switch (direction) {
			case PlayerMoveDirection.Right:
				velocity.x = this.playerSpeed;
				break;
			case PlayerMoveDirection.UpRight:
				velocity.x = this.playerSpeed;
				velocity.y = -this.playerSpeed;
				break;
			case PlayerMoveDirection.Up:
				velocity.y = -this.playerSpeed;
				break;
			case PlayerMoveDirection.UpLeft:
				velocity.x = -this.playerSpeed;
				velocity.y = -this.playerSpeed;
				break;
			case PlayerMoveDirection.Left:
				velocity.x = -this.playerSpeed;
				break;
			case PlayerMoveDirection.DownLeft:
				velocity.x = -this.playerSpeed;
				velocity.y = this.playerSpeed;
				break;
			case PlayerMoveDirection.Down:
				velocity.y = this.playerSpeed;
				break;
			case PlayerMoveDirection.DownRight:
				velocity.x = this.playerSpeed;
				velocity.y = this.playerSpeed;
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
