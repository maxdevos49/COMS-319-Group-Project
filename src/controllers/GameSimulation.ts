import { b2World, b2Vec2 } from "../../lib/box2d-physics-engine/Box2D";

import { Player } from "./Player";

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
   */
  private players: Player[];

  /**
   * Construct a new simulation. The simulation begins running as soon as it
   * is created.
   */
  constructor() {
    this.world = new b2World(gravity);
    this.fps = fps;
    this.frame = 0;
    this.players = [];
    setInterval(this.nextFrame, 1000);
  }

  /**
   * Advance to the next physics frame.
   * 
   * @return {void}
   */
  nextFrame(): void {
    this.world.Step(timeStep, velocityIterations, positionIterations);
    this.frame++;

    // this.players.forEach(player => {
    //   const position: b2Vec2 = player.getBody().GetPosition();
    //   const angle: number = player.getBody().GetAngle();
    //   console.log(
    //     "Player " + player.getId() + ": ",
    //     position.x.toFixed(2),
    //     position.y.toFixed(2),
    //     angle.toFixed(2)
    //   );
    // });
  }

  /**
   * Generate a new player and add it to the world.
   * 
   * @param {string} id - The UUID of the player.
   */
  addPlayer(id: string): void {
    const player: Player = new Player(id, this.world);
    this.players.push(player);
  }

  /**
   * Process a move update from a client.
   * 
   * @param {IPlayerMoveUpdate} moveUpdate
   */
  updateMove(): void {
    // TODO
  }

  getFrame(): number {
    return this.frame;
  }

  getPlayers(): Player[] {
    return this.players;
  }
}
