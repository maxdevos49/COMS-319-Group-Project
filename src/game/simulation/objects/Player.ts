import {
    b2Body,
    b2BodyDef,
    b2BodyType,
    b2CircleShape,
    b2Fixture,
    b2FixtureDef,
    b2PolygonShape,
    XY,
} from "../../../../lib/box2d-physics-engine/Box2D";
import v1Gen from "uuid/v1";

import { IPositionUpdate } from "../../../public/javascript/game/models/objects/IPositionUpdate";
import {
    PlayerActionState,
    PlayerPositionUpdate
} from "../../../public/javascript/game/models/objects/PlayerPositionUpdate";
import { GameObject } from "./GameObject";
import {
    GameObjectType,
    IObjectDescription
} from "../../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { PlayerObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/PlayerObjectDescription";
import { hitboxCollisionFilter, worldCollisionFilter } from "../CollisionFilters";
import { GameSimulation } from "../GameSimulation";
import { PlayerMoveDirection, PlayerMoveUpdate } from "../../../public/javascript/game/models/PlayerMoveUpdate";
import { Bullet } from "../../../game/simulation/objects/Bullet";
import { HealthEvent } from "../../../public/javascript/game/models/objects/HealthEvent";
import { StatsEvent } from "../../../public/javascript/game/models/objects/StatsEvent";
import { PlayerStats } from "./PlayerStats";

/**
 * A player in the game. Contains the physics body.
 */
export class Player extends GameObject implements IHealth {
    /**
     * The cool-down between shooting in frames
     */
    public static SHOOT_COOLDOWN: number = 5;
    /**
     * Velocity in meters per second that the players should move.
     */
    public static SPEED: number = 6;
    /**
     * The hit box for player weapon collisions
     */
    public static playerHitboxHalfWidth: number = 0.5;
    public static playerHitboxHalfLength: number = 0.5;
    public static playerHitboxShape: b2PolygonShape = new b2PolygonShape().SetAsBox(Player.playerHitboxHalfWidth, Player.playerHitboxHalfLength);

    /**
     * The Box2D physics body used for the physics simulation.
     */
    public body: b2Body;
    /**
     * The collision fixture used to compute player-world collisions
     */
    public playerCollisionFixture: b2Fixture;
    /**
     * The collision fixture used to compute hits on the player (more accurate)
     */
    public playerHitboxFixture: b2Fixture;
    /**
     * The frame which this player last shot
     */
    public lastShotFrame: number;
    /**
     * The player's health that ranges from 0 to 100.
     */
    public health: number;
    /**
     * Stats about the player in the game, such as number of enemies killed.
     */
    public stats: PlayerStats;

    constructor(simulation: GameSimulation, id: string) {
        super(id, GameObjectType.Player, simulation)
        this.id = id;
        this.type = GameObjectType.Player;

        // Assume frame 0 because this variable is only used to restrict shooting speed
        this.lastShotFrame = 0;

        this.health = 100;
        this.stats = {
            enemiesKilled: 0,
            secondsInGame: 0,
            finishPlace: 1,
        };

        // The player is a dynamic body, which means that it is fully simulated,
        // moves in response to forces, and has a finite, non-zero mass.
        const bodyDef: b2BodyDef = new b2BodyDef();
        bodyDef.type = b2BodyType.b2_dynamicBody;
        bodyDef.position.Set(10, 10);
        this.body = this.simulation.world.CreateBody(bodyDef);

        // Fixtures are carried around on the bodies. They define a body's
        // geometry and mass. These are important for collisions.

        // Create fixture for the player colliding with the world
        const playerCollisionFixtureDef: b2FixtureDef = new b2FixtureDef();
        playerCollisionFixtureDef.userData = id;
        playerCollisionFixtureDef.shape = new b2CircleShape((96 / 100) / 2); // 50 m radius
        playerCollisionFixtureDef.filter.Copy(worldCollisionFilter);
        this.playerCollisionFixture = this.body.CreateFixture(playerCollisionFixtureDef, 4.0); // 1.0 kg/m^3 density
        // Create fixture for the player colliding with weapons
        const playerHitboxFixtureDef: b2FixtureDef = new b2FixtureDef();
        playerHitboxFixtureDef.userData = id;
        playerHitboxFixtureDef.shape = Player.playerHitboxShape;
        playerHitboxFixtureDef.filter.Copy(hitboxCollisionFilter);
        this.playerHitboxFixture = this.body.CreateFixture(playerHitboxFixtureDef, 4.0);
    }

    public destroy(): void {
        this.simulation.world.DestroyBody(this.body);
    }

    /**
     * Checks if this player can shoot at the given frame and if it can updates the player cool-down for shooting and
     * returns true.
     * @param frame The frame number to check if the player can shoot on
     */
    public attemptShoot(frame: number): boolean {
        if ((frame - this.lastShotFrame) > Player.SHOOT_COOLDOWN) {
            this.lastShotFrame = frame;
            return true;
        }
        return false;
    }

    /**
     * Gets the PlayerPositionUpdate that describes the current state of the player
     * @param frame The frame for the position update to be made
     */
    public getPositionUpdate(frame: number): IPositionUpdate {
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
     * Gets the NewPlayerObject that describes the state of the player. This can be sent to initialize the clients
     * knowledge of this player
     */
    public getAsNewObject(): IObjectDescription {
        return new PlayerObjectDescription(this.id, this.body.GetPosition().x, this.body.GetPosition().y, this.body.GetAngle());
    }

    public applyPlayerMoveUpdate(move: PlayerMoveUpdate) {
        if (move.updateFacing) {
            this.body.SetAngle(move.facing);
        }
        this.body.SetLinearVelocity(Player.getVelocityVector(move.moveDirection));

        // If the player wants to shoot
        if (move.attemptShoot) {
            // Attempt to shoot, might be stopped by the cool down
            if (this.attemptShoot(this.simulation.frame)) {
                let x: number = this.body.GetPosition().x + Math.cos(this.body.GetAngle()) * (Player.playerHitboxHalfLength + 0.1);
                let y: number = this.body.GetPosition().y + Math.sin(this.body.GetAngle()) * (Player.playerHitboxHalfLength + 0.1);
                let bullet: Bullet = new Bullet(this.simulation, v1Gen(), this.id, x, y, this.body.GetAngle(), 17);
                bullet.body.SetLinearVelocity({
                    x: 20 * Math.cos(bullet.body.GetAngle()) + this.body.GetLinearVelocity().x,
                    y: 20 * Math.sin(bullet.body.GetAngle()) + this.body.GetLinearVelocity().y
                });
                bullet.body.SetLinearDamping(0.3);
                this.simulation.addGameObject(bullet);
            }
        }
    }

    /**
     * Get the velocity for a desired change in position represented by
     * Up, UpLeft, etc.
     *
     * @param direction - The direction the player wants to move.
     * @return a velocity vector.
     */
    private static getVelocityVector(direction: PlayerMoveDirection): XY {
        const velocity: XY = { x: 0, y: 0 };
        switch (direction) {
            case PlayerMoveDirection.Right:
                velocity.x = Player.SPEED;
                break;
            case PlayerMoveDirection.UpRight:
                velocity.x = Player.SPEED;
                velocity.y = -Player.SPEED;
                break;
            case PlayerMoveDirection.Up:
                velocity.y = -Player.SPEED;
                break;
            case PlayerMoveDirection.UpLeft:
                velocity.x = -Player.SPEED;
                velocity.y = -Player.SPEED;
                break;
            case PlayerMoveDirection.Left:
                velocity.x = -Player.SPEED;
                break;
            case PlayerMoveDirection.DownLeft:
                velocity.x = -Player.SPEED;
                velocity.y = Player.SPEED;
                break;
            case PlayerMoveDirection.Down:
                velocity.y = Player.SPEED;
                break;
            case PlayerMoveDirection.DownRight:
                velocity.x = Player.SPEED;
                velocity.y = Player.SPEED;
                break;
        }

        // If the player is moving diagonally, and X and Y components of the
        // velocity add together, which makes the player move faster diagonally
        // compared to moving only up/down/left/right. We divide the X and Y
        // components of the velocity by sqrt(2) to adjust for this.
        if (direction === PlayerMoveDirection.UpRight
            || direction === PlayerMoveDirection.UpLeft
            || direction === PlayerMoveDirection.DownLeft
            || direction === PlayerMoveDirection.DownRight
        ) {
            velocity.x = velocity.x / Math.sqrt(2);
            velocity.y = velocity.y / Math.sqrt(2);
        }

        return velocity;
    }

    public collideWith(object: IObjectDescription) {
        if (object.type === GameObjectType.Bullet) {
            const playerDead: boolean = this.takeDamage(Bullet.DAMAGE);
            if (playerDead) {
                const numAlive = this.simulation.totalPlayers - this.simulation.deadPlayers;

                const bullet: Bullet = object as Bullet;
                const other: GameObject = this.simulation.objects.get(bullet.ownerId);
                if (other.type == GameObjectType.Player) {
                    const otherPlayer: Player = other as Player;
                    otherPlayer.stats.enemiesKilled += 1;

                    // This was the second to last player who died, so the other
                    // player must be the winner.
                    if (numAlive === 1) {
                        otherPlayer.stats.secondsInGame = this.simulation.frame / 30;
                        this.simulation.events.push(new StatsEvent(other.id, otherPlayer.stats));
                    }
                }
            }
        }
    }

    /**
     * Subtract the given amount of HP from this player. This method also
     * handles the player's death (when HP drops to zero).
     * @param damage - The amount of HP to subract from the player.
     * @return true if the player dies as a result of taking damange.
     */
    public takeDamage(damage: number): boolean {
        this.health -= damage;
        // The event will be sent to the client
        this.simulation.events.push(new HealthEvent(this.id, this.health))
        // The player is dead
        if (this.health <= 0) {
            this.stats.secondsInGame = this.simulation.frame / 30;
            this.stats.finishPlace = this.simulation.totalPlayers - this.simulation.deadPlayers;
            this.simulation.events.push(new StatsEvent(this.id, this.stats));
            this.simulation.destroyGameObject(this.id);
            this.simulation.deadPlayers++;
            return true;
        }
        return false;
    }
}
