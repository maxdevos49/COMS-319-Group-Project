import { GameObject } from "./GameObject";
import { AlienObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/AlienObjectDescription";
import { AlienPositionUpdate } from "../../../public/javascript/game/models/objects/AlienPositionUpdate";
import { GameSimulation } from "../GameSimulation";
import { GameObjectType } from "../../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { b2PolygonShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2PolygonShape";
import { b2Body, b2BodyDef, b2BodyType } from "../../../../lib/box2d-physics-engine/Dynamics/b2Body";
import { b2Fixture, b2FixtureDef } from "../../../../lib/box2d-physics-engine/Dynamics/b2Fixture";
import { b2CircleShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2CircleShape";
import { hitboxCollisionFilter, worldCollisionFilter } from "../CollisionFilters";

export class AlienShooter extends GameObject {
    /**
     * The movement speed of the alien
     */
    public static speed: number = 5;

    /**
     * The radius of the area which the alien will collide with other world objects
     */
    public static alienCollisionRadius = 20 / 100;

    /**
     * The hitbox for alien bullet/weapon collisions
     */
    public static alienHitboxHalfWidth: number = 0.5;
    public static alienHitboxHalfLength: number = 0.5;
    public static alienHitboxShape: b2PolygonShape = new b2PolygonShape().SetAsBox(AlienShooter.alienHitboxHalfWidth, AlienShooter.alienHitboxHalfLength);

    /**
     * The Box2D physics body used for the physics simulation.
     */
    public body: b2Body;

    /**
     * The collision fixture used to compute player-world collisions
     */
    public alienCollisionFixture: b2Fixture;
    /**
     * The collision fixture used to compute hits on the alien (more accurate)
     */
    public alienHitboxFixture: b2Fixture;

    constructor(simulation: GameSimulation, id: string, x: number, y: number) {
        super(id, GameObjectType.Alien, simulation);

        const bodyDef: b2BodyDef = new b2BodyDef();
        bodyDef.type = b2BodyType.b2_dynamicBody;
        bodyDef.position.Set(x, y);
        this.body = this.simulation.world.CreateBody(bodyDef);

        // Create fixture for the alien colliding with the world
        const alienCollisionFixtureDef: b2FixtureDef = new b2FixtureDef();
        alienCollisionFixtureDef.userData = id;
        alienCollisionFixtureDef.shape = new b2CircleShape(AlienShooter.alienCollisionRadius);
        alienCollisionFixtureDef.filter.Copy(worldCollisionFilter);
        this.alienCollisionFixture = this.body.CreateFixture(alienCollisionFixtureDef, 4.0); // 1.0 kg/m^3 density

        // Create fixture for the alien colliding with weapons
        const alienHitboxFixtureDef: b2FixtureDef = new b2FixtureDef();
        alienHitboxFixtureDef.userData = id;
        alienHitboxFixtureDef.shape = AlienShooter.alienHitboxShape;
        alienHitboxFixtureDef.filter.Copy(hitboxCollisionFilter);
        this.alienHitboxFixture = this.body.CreateFixture(alienHitboxFixtureDef, 4.0);
    }

    getAsNewObject(): AlienObjectDescription {
        return new AlienObjectDescription(this.id, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
    }

    getPositionUpdate(frame: number): AlienPositionUpdate {
        return new AlienPositionUpdate(this.id, frame, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
    }

}