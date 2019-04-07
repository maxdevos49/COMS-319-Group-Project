import {b2World, b2Vec2} from "../../../lib/box2d-physics-engine/Box2D";

import {Player} from "./Player";
import {PlayerMoveUpdate, PlayerMoveDirection} from "../../public/javascript/models/game/PlayerMoveUpdate";
import {PlayerMoveUpdateQueue} from "../../public/javascript/data-structures/PlayerMoveUpdateQueue";
import {PositionUpdate} from "../../public/javascript/models/game/PositionUpdate";
import {TerrainMap} from "../../public/javascript/models/game/TerrainMap";

interface Change {
	dx: number;
	dy: number;
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

		this.frame = 0;
		this.players = new Map<string, Player>();
		// TODO: noise generator on map
		this.map = new TerrainMap(GameSimulation.mapTileWidth, GameSimulation.mapTileHeight, 0);
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
		});
		this.moves.incrementFrame();
		this.world.Step(GameSimulation.timeStep, GameSimulation.velocityIterations, GameSimulation.positionIterations);
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
			const oldPos = player.getBody().GetPosition();
			const change = this.getPositionChange(move.moveDirection);
			const newPos = new b2Vec2(oldPos.x + change.dx, oldPos.y + change.dy);
			player.getBody().SetPosition(newPos);
		}
	}

	public getFrame(): number {
		return this.frame;
	}

	public getPlayers(): Player[] {
		return Array.from(this.players.values());
	}

	/**
	 * Gets an array of position updates for every object that is in the simulation
	 */
	public getPositionUpdates(): PositionUpdate[] {
		let updates: PositionUpdate[] = [];
		this.players.forEach((player: Player, id: string) => {
			updates.push(player.getPositionUpdate(this.frame))
		});
		return updates;
	}

	private getPositionChange(dir: PlayerMoveDirection): Change {
		const c: Change = {dx: 0, dy: 0};
		switch (dir) {
			case PlayerMoveDirection.Right:
				c.dx = 3;
				break;
			case PlayerMoveDirection.UpRight:
				c.dx = 3;
				c.dy = -3;
				break;
			case PlayerMoveDirection.Up:
				c.dy = -3;
				break;
			case PlayerMoveDirection.UpLeft:
				c.dx = -3;
				c.dy = -3;
				break;
			case PlayerMoveDirection.Left:
				c.dx = -3;
				break;
			case PlayerMoveDirection.DownLeft:
				c.dx = -3;
				c.dy = 3;
				break;
			case PlayerMoveDirection.Down:
				c.dy = 3;
				break;
			case PlayerMoveDirection.DownRight:
				c.dx = 3;
				c.dy = 3;
				break;
		}
		return c;
	}
}
