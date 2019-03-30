import {
  b2Body,
  b2World,
  b2BodyDef,
  b2BodyType,
} from "../../lib/box2d-physics-engine/Box2D";

/**
 * A player in the game. Contains the physics body.
 */
export class Player {
  /**
   * The UUID of the player. This should correspond with the UUID assigned to
   * a particular connection.
   */
  private id: string;

  /**
   * The Box2D physics body used for the physics simulation.
   */
  private body: b2Body;

  constructor(id: string, world: b2World) {
    this.id = id;

    // define the dynamic body
    const bodyDef: b2BodyDef = new b2BodyDef();
    bodyDef.type = b2BodyType.b2_dynamicBody;
    bodyDef.position.Set(0, 0);
    this.body = world.CreateBody(bodyDef);
  }

  getId(): string {
    return this.id;
  }

  getBody(): b2Body {
    return this.body;
  }
}
