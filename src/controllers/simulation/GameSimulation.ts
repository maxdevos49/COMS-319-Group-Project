import { b2World, b2Vec2 } from "../../../lib/box2d-physics-engine/Box2D";

import { Player } from "./Player";
import { PlayerMoveUpdate, PlayerMoveDirection } from "../../public/javascript/models/game/PlayerMoveUpdate";
import { PlayerMoveUpdateQueue } from "../../public/javascript/data-structures/PlayerMoveUpdateQueue";
import { PositionUpdate } from "../../public/javascript/models/game/PositionUpdate";

interface ChangeXY {
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
  public timeStep: number;

  /**
   * Constraint solvers: larger values means better accuracy but worse
   * performance.
   */
  private velocityIterations: number;
  private positionIterations: number;

  /**
   * How many meters (in our case, one pixel == one meter) the player should
   * move for one move update.
   */
  public metersPerMove: number;

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
    this.initBox2d();
    this.metersPerMove = 3;
    this.frame = 0;
    this.players = new Map<string, Player>();
    this.moves = moves;
  }

  private initBox2d() {
    const gravity = new b2Vec2(0, 0);
    this.world = new b2World(gravity);
    this.timeStep = 1 / 30;
    this.velocityIterations = 6;
    this.positionIterations = 2;
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
    this.world.Step(this.timeStep, this.velocityIterations, this.positionIterations);
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
   * Gets an array of position updates for every object that is in the simulation.
   *
   * @return {PositionUpdate[]} An array of position updates.
   */
  public getPositionUpdates(): PositionUpdate[] {
    let updates: PositionUpdate[] = [];
    this.players.forEach((player: Player, id: string) => {
        updates.push(player.getPositionUpdate(this.frame))
    });
    return updates;
  }

  /**
   * Get the change in X and Y coordinates for a desired change in position
   * represented by Up, UpLeft, etc.
   *
   * @param {PlayerMoveDirection} direction - The direction the player wants to move.
   * @return {ChangeXY} An object containing the change in X and Y.
   */
  private getPositionChange(direction: PlayerMoveDirection): ChangeXY {
    const posChange: ChangeXY = { dx: 0, dy: 0 };

    switch (direction) {
      case PlayerMoveDirection.Right:
        posChange.dx = this.metersPerMove;
        break;
      case PlayerMoveDirection.UpRight:
        posChange.dx = this.metersPerMove;
        posChange.dy = -this.metersPerMove;
        break;
      case PlayerMoveDirection.Up:
        posChange.dy = -this.metersPerMove;
        break;
      case PlayerMoveDirection.UpLeft:
        posChange.dx = -this.metersPerMove;
        posChange.dy = -this.metersPerMove;
        break;
      case PlayerMoveDirection.Left:
        posChange.dx = -this.metersPerMove;
        break;
      case PlayerMoveDirection.DownLeft:
        posChange.dx = -this.metersPerMove;
        posChange.dy = this.metersPerMove;
        break;
      case PlayerMoveDirection.Down:
        posChange.dy = this.metersPerMove;
        break;
      case PlayerMoveDirection.DownRight:
        posChange.dx = this.metersPerMove;
        posChange.dy = this.metersPerMove;
        break;
    }

    return posChange;
  }
}
