import { b2World, b2Vec2 } from "../../lib/box2d-physics-engine/Box2D";

import { Player } from "./Player";
import { PlayerMoveUpdate, PlayerMoveDirection } from "../public/javascript/models/game/PlayerMoveUpdate";
import { PlayerMoveUpdateQueue } from "../public/javascript/data-structures/PlayerMoveUpdateQueue";

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
  private timeStep: number;

  /**
   * Constraint solvers: larger values means better accuracy but worse
   * performance.
   */
  private velocityIterations: number = 6;
  private positionIterations: number = 2;

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
   * @param {boolean} start - True if the simulation should start right away.
   */
  constructor(moves: PlayerMoveUpdateQueue, start: boolean = true) {
    // init for Box2D
    const gravity = new b2Vec2(0, 0);
    this.world = new b2World(gravity);
    this.timeStep = 1 / 30;
    this.velocityIterations = 6;
    this.positionIterations = 2;

    this.frame = 0;
    this.players = new Map<string, Player>();
    this.moves = moves;
    if (start) {
      setInterval(this.nextFrame, 1000);
    }
  }

  /**
   * Advance to the next physics frame.
   *
   * @return {void}
   */
  nextFrame(): void {
    // TODO: iterate through players and process updates
    this.world.Step(this.timeStep, this.velocityIterations, this.positionIterations);
    this.frame++;
  }

  /**
   * Generate a new player and add it to the world.
   *
   * @param {string} id - The UUID of the player.
   */
  addPlayer(id: string): void {
    const player: Player = new Player(id, this.world);
    this.players.set(id, player);
  }

  /**
   * Process a move update from a client.
   *
   * @param {PlayerMoveUpdate} move - An object containing move information.
   */
  updateMove(move: PlayerMoveUpdate | null): void {
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

  getFrame(): number {
    return this.frame;
  }

  getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  private getPositionChange(dir: PlayerMoveDirection): Change {
    const c: Change = { dx: 0, dy: 0 };
    switch (dir) {
      case PlayerMoveDirection.Right:
        c.dx = 1;
        break;
      case PlayerMoveDirection.UpRight:
        c.dx = 1;
        c.dy = 1;
        break;
      case PlayerMoveDirection.Up:
        c.dy = 1;
        break;
      case PlayerMoveDirection.LeftUp:
        c.dx = -1;
        c.dy = 1;
        break;
      case PlayerMoveDirection.Left:
        c.dx = -1;
        break;
      case PlayerMoveDirection.DownLeft:
        c.dx = -1;
        c.dy = -1;
        break;
      case PlayerMoveDirection.Down:
        c.dy = -1;
        break;
      case PlayerMoveDirection.RightDown:
        c.dx = 1;
        c.dy = -1;
        break;
    }
    return c;
  }
}
