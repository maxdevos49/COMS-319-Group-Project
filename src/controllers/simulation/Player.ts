import {b2Body, b2BodyDef, b2BodyType, b2World, b2FixtureDef, b2PolygonShape} from "../../../lib/box2d-physics-engine/Box2D";
import {PositionUpdate} from "../../public/javascript/models/game/PositionUpdate";
import {PlayerActionState, PlayerPositionUpdate} from "../../public/javascript/models/game/PlayerPositionUpdate";

const PLAYER: number = 0x0001;

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

    // define the dynamic body which contains location, position, etc.
    const bodyDef: b2BodyDef = new b2BodyDef();
    bodyDef.type = b2BodyType.b2_dynamicBody;
    bodyDef.position.Set(0, 0);
    this.body = world.CreateBody(bodyDef);

    // create a fixture which will allow us to attach a shape to the body
    const fixture: b2FixtureDef = new b2FixtureDef();
    fixture.shape = new b2PolygonShape().SetAsBox(50, 50);
    fixture.density = 1;
    fixture.filter.categoryBits = PLAYER;
    fixture.filter.maskBits = -1; // collide with everything
    this.body.CreateFixture(fixture, 1);
  }

  /**
   * Gets the PlayerPositionUpdate that describes the current state of the player
   * @param {number} frame - The frame for the position update to be made
   */
  public getPositionUpdate(frame: number): PositionUpdate {
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
   * Get the ID of the player.
   *
   * @return {string} The ID of the player.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Get the player's physics body.
   *
   * @return {b2Body} The Box2D body used in the physics engine.
   */
  getBody(): b2Body {
    return this.body;
  }
}
