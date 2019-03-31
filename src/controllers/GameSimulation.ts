import { b2World, b2Vec2 } from "../../lib/box2d-physics-engine/Box2D";

import { Player } from "./Player";
import { PlayerMoveUpdate, PlayerMoveDirection } from "../public/javascript/models/game/PlayerMoveUpdate";

// no gravity since this is a top down game and we don't want the players
// to move anywhere without their consent
const gravity = new b2Vec2(0, 0);

// simulate physics equations 30 times per second
const fps: number = 30;
const timeStep: number = 1 / fps;

// tuning the constraint solver: larger values means better accuracy but
// worse performance
const velocityIterations: number = 6;
const positionIterations: number = 2;

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
   * The frames per second processed by the physics engine.
   */
  private fps: number;

  /**
   * The current frame number of the simulation.
   */
  private frame: number;

  /**
   * List of players (dynamic bodies) in the simulation.
   * Map makes it easier to update players by their ID.
   */
  private players: Map<string, Player>;

  /**
   * Construct a new simulation. The simulation begins running as soon as it
   * is created.
   */
  constructor(begin: boolean = true) {
    this.world = new b2World(gravity);
    this.fps = fps;
    this.frame = 0;
    this.players = new Map<string, Player>();

    if (begin) {
      setInterval(this.nextFrame, 1000);
    }
  }

  /**
   * Advance to the next physics frame.
   *
   * @return {void}
   */
  nextFrame(): void {
    this.world.Step(timeStep, velocityIterations, positionIterations);
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
  updateMove(move: PlayerMoveUpdate): void {
    let player: Player | undefined = this.players.get(move.id);
    player = (player as Player);
    if (move.updateFacing) {
      player.getBody().SetAngle(move.facing);
    }
    const oldPos = player.getBody().GetPosition();
    const change = this.getPositionChange(move.moveDirection);
    const newPos = new b2Vec2(oldPos.x + change.dx, oldPos.y + change.dy);
    player.getBody().SetPosition(newPos);
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
