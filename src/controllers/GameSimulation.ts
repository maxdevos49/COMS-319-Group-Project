import { b2World, b2Vec2 } from "../../lib/box2d-physics-engine/Box2D";
import v1Gen from "uuid/v1";

import { Player } from "./Player";

const gravity = new b2Vec2(0, 0);

export class GameSimulation {
  private world: b2World;
  private players: Player[];

  constructor() {
    this.world = new b2World(gravity);
    this.players = [];
  }

  addPlayer(): string {
    const player: Player = new Player(v1Gen(), this.world);
    this.players.push(player);
    return player.getId();
  }

  getPlayers(): Player[] {
    return this.players;
  }
}
