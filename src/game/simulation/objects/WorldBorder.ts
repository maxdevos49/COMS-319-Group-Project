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
import { BorderDifficultyLevelEvent } from "../../../public/javascript/game/models/objects/BorderDifficultyLevelEvent";

export class WorldBorder extends GameObject {

    public static moveSpeed: number = 5;

    public static alienSearchRadius: number = AlienShooter.alienSightRadius + 2;

    /**
     * The x coordinate that this border is centered on
     */
    centeredX: number;

    /**
     * The y coordinate that this border is centered on
     */
    centeredY: number;

    /**
     * An array given the radius of the border at every stage in the border shrink process
     */
    moveStages: number[];

    /**
     * Which stage in the moveStages array the border is in right now
     */
    curStage: number;

    /**
     * The radius of the border right now
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

    /**
     * The ratio that the difficulty goes up per 100 pixels (up from the base difficulty of 1 when outside of the border)
     */
    public static difficultyLevelDistanceRatio: number = .2;

    /**
     * The map from player id to the last computed level of difficulty for them
     */
    difficultyLevel: Map<string, number>;

    constructor(id: string, simulation: GameSimulation, centerX: number, centerY: number, moveStages: number[]) {
        super(id, GameObjectType.WorldBorder, simulation);
        this.centeredX = centerX;
        this.centeredY = centerY;
        this.moveStages = moveStages;
        this.curStage = 0;
        this.curRadius = moveStages[0];
        this.difficultyLevel = new Map<string, number>();

        const bodyDef: b2BodyDef = new b2BodyDef();
        bodyDef.type = b2BodyType.b2_staticBody;
        bodyDef.position.Set(centerX, centerY);
        this.body = simulation.world.CreateBody(bodyDef);

        const worldBorderCollisionFixtureDef: b2FixtureDef = new b2FixtureDef();
        worldBorderCollisionFixtureDef.filter.Copy(worldBorderCollisionFilter);
        worldBorderCollisionFixtureDef.shape = new b2CircleShape(this.curRadius);
        this.worldBorderCollisionFixture = this.body.CreateFixture(worldBorderCollisionFixtureDef);
    }

    update(): void {
        let players: Player[] = this.simulation.getAllObjectsOfType(GameObjectType.Player) as Player[];
        let aliens: AlienShooter[] = this.simulation.getAllObjectsOfType(GameObjectType.Alien) as AlienShooter[];

        // Check and attempt to spawn monsters once a second
        if (this.simulation.frame % 30 == 15) {

            // Assign all players a difficulty level based on how far from the border they are
            players.forEach((player) => {
                let dist: number = this.distanceFromBorder(player.body.GetPosition().x, player.body.GetPosition().y);

                let newDifficultyLevel: number;
                if (dist > 0) {
                    newDifficultyLevel = 1 + dist * WorldBorder.difficultyLevelDistanceRatio;
                } else {
                    newDifficultyLevel = 0;
                }

                // If the players new difficulty level is different than the old one then send an event for it
                if (this.difficultyLevel.has(player.id)) {
                    if (this.difficultyLevel.get(player.id) != newDifficultyLevel) {
                        this.simulation.events.push(new BorderDifficultyLevelEvent(player.id, newDifficultyLevel));
                    }
                }
                this.difficultyLevel.set(player.id, newDifficultyLevel);
            });

            // Check if every player has enough aliens around them given their difficulty level. If not then attempt
            // to spawn another
            players.filter((player) => {
                // Find the number of aliens in range of the player
                let aliensInRange: number = aliens.filter((alien) => {
                    let dx = alien.body.GetPosition().x - player.body.GetPosition().x;
                    let dy = alien.body.GetPosition().y - player.body.GetPosition().y;
                    return Math.sqrt(dx * dx + dy * dy) < WorldBorder.alienSearchRadius;
                }).length;
                // Returns true if the player can have more monsters around them given their difficulty level
                return aliensInRange < this.difficultyLevel.get(player.id);
            }).forEach((player) => {
                this.attemptSpawnAlien(player);
            });
        }
    }

    /**
     * Makes one attempt to spawn an alien on alien sight radius away from the player. If spawn attempt falls on a
     * tile that is inside the border or is not ground then this method will fail and do nothing
     * @param player The player to attempt to spawn the monster next to
     */
    private attemptSpawnAlien(player: Player) {
        // Randomly select an angle and then place the alien one sight radius away at that angle
        let attemptAngle: number = Math.random() * 2 * Math.PI;
        let attemptX: number = player.body.GetPosition().x + Math.cos(attemptAngle) * AlienShooter.alienSightRadius;
        let attemptY: number = player.body.GetPosition().y + Math.sin(attemptAngle) * AlienShooter.alienSightRadius;

        // Check that the point is outside of the border
        if (this.distanceFromBorder(attemptX, attemptY) != 0) {
            // Check that the map has ground at the location
            if (this.simulation.map.getHighestLevel(Math.round(attemptX / .32), Math.round(attemptY / .32)) == 0) {
                // Spawn the monster
                this.simulation.addGameObject(new AlienShooter(this.simulation, v1Gen(), attemptX, attemptY));
            }
        }
    }

    /**
     * Gets how far from the edge of the border the given point is
     * @param x The x coordinate to check
     * @param y The y coordinate to check
     * @returns The distance from the border or zero if the point is inside of the border
     */
    public distanceFromBorder(x: number, y: number): number {
        let dx: number = x - this.centeredX;
        let dy: number = y - this.centeredY;
        let dist: number = Math.sqrt(dx * dx + dy * dy) - this.curRadius;
        // Don't return negative distance, just return 0
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