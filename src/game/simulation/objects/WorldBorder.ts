import { GameObject } from "./GameObject";
import { GameSimulation } from "../GameSimulation";
import { GameObjectType } from "../../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { WorldBorderObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/WorldBorderObjectDescription";
import { WorldBorderPositionUpdate } from "../../../public/javascript/game/models/objects/WorldBorderPositionUpdate";
import { b2Body, b2BodyDef, b2BodyType } from "../../../../lib/box2d-physics-engine/Dynamics/b2Body";
import { b2Fixture, b2FixtureDef } from "../../../../lib/box2d-physics-engine/Dynamics/b2Fixture";
import { worldBorderCollisionFilter } from "../CollisionFilters";
import { b2CircleShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2CircleShape";
import { Player } from "./Player";
import { AlienShooter } from "./AlienShooter";
import v1Gen from "uuid/v1";

export class WorldBorder extends GameObject {

    public static moveSpeed: number = 5;

    /**
     * The x coordinate that this border is centered on
     */
    centeredX: number;

    /**
     * The y coordinate that this border is centered on
     */
    centeredY: number;

    /**
     * The radius that this world border starts with
     */
    beginRadius: number;
    /**
     * The radius that this world border will end with
     */
    endRadius: number;

    /**
     * The current radius of this world border
     */
    curRadius: number;

    /**
     * The body for the collisions area of the world border
     */
    body: b2Body;

    /**
     * The fixture for collisions with the inside are of the world border
     */
    worldBorderCollisionFixture: b2Fixture;

    constructor(id: string, simulation: GameSimulation, centerX: number, centerY: number, beginRadius: number, endRadius: number) {
        super(id, GameObjectType.WorldBorder, simulation);
        this.centeredX = centerX;
        this.centeredY = centerY;
        this.beginRadius = beginRadius;
        this.endRadius = endRadius;
        this.curRadius = beginRadius;

        const bodyDef: b2BodyDef = new b2BodyDef();
        bodyDef.type = b2BodyType.b2_staticBody;
        bodyDef.position.Set(centerX, centerY);
        this.body = simulation.world.CreateBody(bodyDef);

        const worldBorderCollisionFixtureDef: b2FixtureDef = new b2FixtureDef();
        worldBorderCollisionFixtureDef.filter.Copy(worldBorderCollisionFilter);
        worldBorderCollisionFixtureDef.shape = new b2CircleShape(this.beginRadius);
        this.worldBorderCollisionFixture = this.body.CreateFixture(worldBorderCollisionFixtureDef);
    }

    update(): void {
        let players: Player[] = this.simulation.getAllObjectsOfType(GameObjectType.Player) as Player[];
        let aliens: AlienShooter[] = this.simulation.getAllObjectsOfType(GameObjectType.Alien) as AlienShooter[];

        players.filter((player) => {
            return this.distanceFromBorder(player.body.GetPosition().x, player.body.GetPosition().y) > this.curRadius;
        }).filter((player) => {
            let aliensInRange: number = aliens.filter((alien) => {
                let dx = alien.body.GetPosition().x - player.body.GetPosition().x;
                let dy = alien.body.GetPosition().y - player.body.GetPosition().y;
                return Math.sqrt(dx * dx + dy * dy) < AlienShooter.alienSightRadius;
            }).length;

            return aliensInRange < 3;
        }).forEach((player) => {
           this.attemptSpawnAlien(player);
        });
    }

    private attemptSpawnAlien(player: Player) {
        let attemptAngle: number = Math.random() * 2 * Math.PI;
        let attemptX: number = player.body.GetPosition().x + Math.cos(attemptAngle) * AlienShooter.alienSightRadius;
        let attemptY: number = player.body.GetPosition().y + Math.sin(attemptAngle) * AlienShooter.alienSightRadius;

        if (this.distanceFromBorder(attemptX, attemptY) != 0) {
            console.log(Math.round(attemptX / .32), Math.round(attemptY / .32));
            if (this.simulation.map.getHighestLevel(Math.round(attemptX / .32), Math.round(attemptY / .32)) == 0) {
                this.simulation.addGameObject(new AlienShooter(this.simulation, v1Gen(), attemptX, attemptY));
                console.log("Monster spawned! Yikes!");
            }
        }
    }

    public distanceFromBorder(x: number, y: number): number {
        let dx: number = x - this.centeredX;
        let dy: number = y - this.centeredY;
        let dist: number = Math.sqrt(dx * dx + dy * dy);

        return (dist < 0) ? 0 : dist;
    }

    destroy(): void {
        this.simulation.world.DestroyBody(this.body);
    }

    getAsNewObject(): WorldBorderObjectDescription {
        return new WorldBorderObjectDescription(this.id, this.centeredX, this.centeredX, this.curRadius);
    }

    getPositionUpdate(frame: number): WorldBorderPositionUpdate {
        return new WorldBorderPositionUpdate(this.id, frame, this.curRadius);
    }

}