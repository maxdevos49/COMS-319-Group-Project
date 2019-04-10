import {
	b2World,
	b2Vec2,
	b2ContactListener,
	b2Contact,
	XY,
} from "../../../lib/box2d-physics-engine/Box2D";

import {Player} from "./objects/Player";
import {PlayerMoveUpdate, PlayerMoveDirection} from "../../public/javascript/models/game/PlayerMoveUpdate";
import {PlayerMoveUpdateQueue} from "../../public/javascript/data-structures/PlayerMoveUpdateQueue";
import {IPositionUpdate} from "../../public/javascript/models/game/objects/IPositionUpdate";
import {TerrainMap} from "../../public/javascript/models/game/TerrainMap";
import {IObjectDescription} from "../../public/javascript/models/game/objects/IObjectDescription";
import {TerrainGenerator} from "./TerrainGenerator";

// DEBUG: Write to the console when bodies contact each other
class ContactListener extends b2ContactListener {
	public BeginContact(contact: b2Contact): void {
		console.log('Contact detected');
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
	private world: b2World;

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
	private frame: number;

	/**
	 * List of players (dynamic bodies) in the simulation.
	 * The Map makes it easier to update players by their ID.
	 */
	private players: Map<string, Player>;
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

		this.playerSpeed = 10;
		this.frame = 0;
		this.players = new Map<string, Player>();
		this.newObjectsIds = [];
		this.map = new TerrainMap(GameSimulation.mapTileWidth, GameSimulation.mapTileHeight, 0);
		TerrainGenerator.fillTerrain(this.map);
	}

	/**
	 * Advance to the next physics frame.
	 *
	 * @return {void}
	 */
	public nextFrame(): void {
		this.getPlayers().forEach((player) => {
			const move = this.moves.popPlayerMoveUpdate(player.getId());
			this.updateMove(move);

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
		this.frame++;
	}

	/**
	 * Generate a new player and add it to the world.
	 *
	 * @param {string} id - The UUID of the player.
	 */
	public addPlayer(id: string): void {
		const player: Player = new Player(id, this.world);
		this.players.set(id, player);
		this.newObjectsIds.push(id);
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
		let player: Player | undefined = this.players.get(move.id);
		if (player !== undefined) {
			if (move.updateFacing) {
				player.getBody().SetAngle(move.facing);
			}
			player.getBody().SetLinearVelocity(this.getVelocityVector(move.moveDirection));
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
	 * Get a list of all players in the simulation.
	 *
	 * @return {Player[]} An array of players currently in the simulation.
	 */
	public getPlayers(): Player[] {
		return Array.from(this.players.values());
	}

	/**
	 * Gets an array of position updates for every object that is in the simulation
	 *
	 * @return {PositionUpdate[]} An array of position updates.
	 */
	public getPositionUpdates(): IPositionUpdate[] {
		let updates: IPositionUpdate[] = [];
		this.players.forEach((player: Player, id: string) => {
			updates.push(player.getPositionUpdate(this.frame))
		});
		return updates;
	}

	/**
	 * Maps all of the objects that are in the game now to an object description that describes it
	 */
	public getObjectDescriptions(): IObjectDescription[] {
		let descriptions: IObjectDescription[] = [];
		this.players.forEach((player: Player, id: string) => {
			descriptions.push(player.getAsNewObject());
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
		let newObjectsDescriptions: IObjectDescription[] = this.newObjectsIds.map((id: string) => this.players.get(id))
			.filter((player: Player) => player !== undefined)
			.map((player: Player) => player.getAsNewObject());
		this.newObjectsIds = [];
		return newObjectsDescriptions;
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
		return velocity;
	}
}
