import { GameObject } from "./GameObject";
import { AlienObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/AlienObjectDescription";
import { AlienPositionUpdate } from "../../../public/javascript/game/models/objects/AlienPositionUpdate";
import { GameSimulation } from "../GameSimulation";
import {
    GameObjectType,
    IObjectDescription
} from "../../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { b2PolygonShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2PolygonShape";
import { b2Body, b2BodyDef, b2BodyType } from "../../../../lib/box2d-physics-engine/Dynamics/b2Body";
import { b2Fixture, b2FixtureDef } from "../../../../lib/box2d-physics-engine/Dynamics/b2Fixture";
import { b2CircleShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2CircleShape";
import { hitboxCollisionFilter, worldCollisionFilter } from "../CollisionFilters";
import { Player } from "./Player";
import { Bullet } from "./Bullet";
import v1Gen from "uuid/v1";
import { HealthEvent } from "../../../public/javascript/game/models/objects/HealthEvent";

export class AlienShooter extends GameObject {
    /**
     * The movement speed of the alien
     */
    public static speed: number = 3;

    /**
     * The radius of the area which the alien will collide with other world objects
     */
    public static alienCollisionRadius = 0.2;

    /**
     * The hitbox for alien bullet/weapon collisions
     */
    public static alienHitboxHalfWidth: number = 0.4;
    public static alienHitboxHalfLength: number = 0.4;
    public static alienHitboxShape: b2PolygonShape = new b2PolygonShape().SetAsBox(AlienShooter.alienHitboxHalfWidth, AlienShooter.alienHitboxHalfLength);

    /**
     * The radius which this alien can see players
     */
    public static alienSightRadius: number = 10;

    /**
     * The distance at which the alien will stop tracking the player
     */
    public static alienGapDistance: number = 3;

    /**
     * The id the object ths alien is currently targeting
     */
    public currentTargetId: string;

    /**
     * The distance at which the alien will shoot the player
     */
    public static alienShootDistance: number = 5;

    /**
     * The rate at which this alien will shoot in bullets per second
     */
    public static alienFireRate: number = 2;

    /**
     * The last frame that this alien shot a bullet at
     */
    public lastShotFrame: number;

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

    /**
     * The health of the alien
     */
    public health: number;

    constructor(simulation: GameSimulation, id: string, x: number, y: number) {
        super(id, GameObjectType.Alien, simulation);

        this.lastShotFrame = 0;
        this.health = 100;

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

    destroy(): void {
        this.simulation.world.DestroyBody(this.body);
    }

    update(): void {
        // If the monster is currently targeting a player then make sure the player is still in range
        if (this.currentTargetId) {
            let currentTarget: Player = this.simulation.objects.get(this.currentTargetId) as Player;
            if (!currentTarget || this.distanceFrom(currentTarget) > AlienShooter.alienSightRadius) this.currentTargetId = null;
        }

        if (!this.currentTargetId) {
            let toTarget: Player = null;
            for (let obj of this.simulation.objects.values()) {
                if (obj.type == GameObjectType.Player) {
                    let player: Player = obj as Player;
                    if (this.distanceFrom(player) <= AlienShooter.alienSightRadius) {
                        if (toTarget) {
                            if (this.distanceFrom(player) < this.distanceFrom(toTarget)) {
                                toTarget = player;
                            }
                        } else {
                            toTarget = player;
                        }
                    }
                }
            }

            if (toTarget) {
                this.currentTargetId = toTarget.id;
            }
        }

        if (this.currentTargetId) {
            let currentTarget: Player = this.simulation.objects.get(this.currentTargetId) as Player;

            let dx: number = currentTarget.body.GetPosition().x - this.body.GetPosition().x;
            let dy: number = currentTarget.body.GetPosition().y - this.body.GetPosition().y;
            let angleToPlayer = Math.atan2(dy, dx);

            this.body.SetAngle(angleToPlayer);

            if (this.distanceFrom(currentTarget) > AlienShooter.alienGapDistance) {
                this.body.SetLinearVelocity({x: AlienShooter.speed * Math.cos(angleToPlayer), y: AlienShooter.speed * Math.sin(angleToPlayer)});
            } else {
                this.body.SetLinearVelocity({x: 0, y: 0});
            }

            if (this.distanceFrom(currentTarget) < AlienShooter.alienShootDistance && this.lastShotFrame + (30 * AlienShooter.alienFireRate) < this.simulation.frame) {
                console.log("shooting");
                this.simulation.addGameObject(new Bullet(this.simulation, v1Gen(), this.id, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle(), 17, 20, AlienShooter.alienHitboxHalfLength + .2))
                this.lastShotFrame = this.simulation.frame;
            }
        } else {
            this.body.SetLinearVelocity({x: 0, y: 0});
        }
    };

    distanceFrom(player: Player): number {
        let dx: number = player.body.GetPosition().x - this.body.GetPosition().x;
        let dy: number = player.body.GetPosition().y - this.body.GetPosition().y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    getAsNewObject(): AlienObjectDescription {
        return new AlienObjectDescription(this.id, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
    }

    getPositionUpdate(frame: number): AlienPositionUpdate {
        return new AlienPositionUpdate(this.id, frame, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
    }

    public collideWith(object: IObjectDescription) {
        if (object.type === GameObjectType.Bullet) {
            this.takeDamage(Bullet.DAMAGE);
        }
    }

    public takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.simulation.destroyGameObject(this.id);
        }
    }

}