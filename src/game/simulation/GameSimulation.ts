import { b2Contact, b2Vec2, b2World } from "../../../lib/box2d-physics-engine/Box2D";

import { Player } from "./objects/Player";
import { GameObject } from "./objects/GameObject";
import { TerrainMap } from "../../public/javascript/game/models/TerrainMap";
import { PlayerMoveUpdateQueue } from "../../public/javascript/game/data-structures/PlayerMoveUpdateQueue";
import { PlayerMoveUpdate, PlayerMoveDirection } from "../../public/javascript/game/models/PlayerMoveUpdate";
import { IPositionUpdate } from "../../public/javascript/game/models/objects/IPositionUpdate";
import { IEvent } from "../../public/javascript/game/models/objects/IEvent";
import { TerrainGenerator } from "./terrain/TerrainGenerator";
import { GameObjectType, IObjectDescription } from "../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { AlienShooter } from "./objects/AlienShooter";
import v1Gen from "uuid/v1";
import { WorldBorder } from "./objects/WorldBorder";

/**
 * Simulation of the physical world of the game.
 */
export class GameSimulation {
    /**
     * Starting point for a Box2D simulation.
     */
    public world: b2World;

    /**
     * The number of times per second tht Box2D will process physics equations.
     */
    public static readonly timeStep: number = 1 / 30;

    /**
     * Constraint solvers: larger values means better accuracy but worse
     * performance.
     */
    private static readonly velocityIterations: number = 6;
    private static readonly positionIterations: number = 2;

    /**
     * The radius around the center which the players will spawn
     */
    public static readonly playerSpawnRadius: number = 70;

	/**
	 * The current frame number of the simulation.
	 */
    public frame: number;

    /**
     * List of objects (dynamic bodies) in the simulation.
     * The Map makes it easier to update players by their ID.
     */
    public objects: Map<string, GameObject>;

    /**
     * The number of players in the game.
     */
    public totalPlayers: number;
    /**
     * The number of players in the game that are alive.
     */
    public deadPlayers: number;
    /**
     * The terrain map for this simulation, object represents all of parts of the game world that don't change
     */
    public map: TerrainMap;
    /**
     * A list of events to be sent to clients.
     */
    public events: IEvent[];
    /**
     * A reference to the move queue in the game server.
     */
    private moves: PlayerMoveUpdateQueue;
    /**
     * An array containing the ids of new objects that now exist in the simulation
     */
    private newObjectsIds: string[];
    /**
     * An array containing the ids of the objects that have been deleted from the simulation
     */
    private deletedObjectIds: string[];

    /**
     * A reference to the world border which is also contained in the objects map
     */
    private worldBorder: WorldBorder;

    /**
     * Construct a new simulation. The simulation starts running as soon as it
     * is created unless the start parameter is false (it's true by default).
     *
     * @param moves - A queue of pending moves.
     * @param generateRandomTerrain - Optional parameter which, if true, will cause the simulation to generate a random terrain with structures
     */
    constructor(moves: PlayerMoveUpdateQueue, generateRandomTerrain?: boolean) {
        this.moves = moves;

        // Initialize the box2d world
        const gravity = new b2Vec2(0, 0);
        this.world = new b2World(gravity);

        this.frame = 0;
        this.objects = new Map<string, GameObject>();
        this.totalPlayers = 0;
        this.deadPlayers = 0;
        this.events = [];
        this.newObjectsIds = [];
        this.deletedObjectIds = [];
        if (generateRandomTerrain) {
            this.map = TerrainGenerator.generateTerrain(this,500, 500);
        } else {
            // This will only be called when the test suite is running to avoid the expensive terrain generation operation
            this.map = new TerrainMap(500, 500, 32, 32, [], [], 1);
        }

        this.worldBorder = new WorldBorder(v1Gen(), this, 250 * .32, 250 * .32, [110, 70, 40, 10]);
        this.addGameObject(this.worldBorder);
    }

    /**
     * Advance to the next physics frame.
     */
    public nextFrame(): void {
        this.objects.forEach((object) => {
            let move = this.moves.popPlayerMoveUpdate(object.id);
            if (move != null) {
                // This must be a move for a player since it came from the
                // PlayerMoveUpdateQueue.
                this.updateMove(move);
            } else if (object.type === GameObjectType.Player) {
                // The the current object is a Player, and there was no move
                // for the player, use a default move update.
                // TODO: Get correct frame number when we start using it.
                move = new PlayerMoveUpdate(
                    object.id,
                    0,
                    0,
                    false,
                    PlayerMoveDirection.None,
                    false
                );
                this.updateMove(move);
            }

            // Update the game object
            object.update();
        });

        this.moves.incrementFrame();
        this.world.Step(
            GameSimulation.timeStep,
            GameSimulation.velocityIterations,
            GameSimulation.positionIterations
        );

        // Check collisions
        let curContact: b2Contact = this.world.GetContactList();
        while (curContact != null) {
            if (!curContact.IsTouching()) {
                curContact = curContact.m_next;
                continue;
            }

            // IDs of objects stored as user data
            let ida: string = curContact.GetFixtureA().m_userData;
            let idb: string = curContact.GetFixtureB().m_userData;
            // Check that both objects exist in the map and retrieve them
            let objecta: GameObject = this.objects.get(ida);
            let objectb: GameObject = this.objects.get(idb);
            if (objecta && objectb) {
                objecta.collideWith(objectb);
                objectb.collideWith(objecta);
            }

            curContact = curContact.m_next;
        }

        // Check if the border should move in
        let expectBorderStage = Math.floor(this.worldBorder.moveStages.length * (this.deadPlayers / this.totalPlayers));
        if (this.worldBorder.curStage != expectBorderStage) this.worldBorder.attemptAdvanceBorderStage();

        this.frame++;
    }

    /**
     * Specifies what players will be in this game (should only be called once)
     * @param playerIds The array of players that will be playing in this game simulation
     */
    public setPlayers(playerIds: string[]): void {
        for (let i = 0; i < playerIds.length; i++) {
            // TODO: Check that this is a valid spawn
            let spawnX = (this.map.width * .32 / 2) + GameSimulation.playerSpawnRadius * Math.cos(2 * Math.PI * (i / playerIds.length));
            let spawnY = (this.map.height * .32 / 2) + GameSimulation.playerSpawnRadius * Math.sin(2 * Math.PI * (i / playerIds.length));
            console.log("spawning player at " + spawnX + " " + spawnY);
            let player: Player = new Player(this, playerIds[i]);
            player.body.SetPositionXY(spawnX, spawnY);
            this.objects.set(playerIds[i], player);
            this.newObjectsIds.push(playerIds[i]);
        }

        this.totalPlayers = playerIds.length;
    }

    /**
     * Gets an array of all of the objects that have the given type
     * @param type The type to get all of the objects that are of the given type
     */
    public getAllObjectsOfType(type: GameObjectType) {
        let ofType: GameObject[] = [];
        for (let obj of this.objects.values()) {
            if (obj.type == type) ofType.push(obj);
        }
        return ofType;
    }

    /**
     * Adds the game object to the simulation. This doesn't add it to the world (objects themselves are responsible for this
     * @param object - The game object to add to this simulation
     */
    public addGameObject(object: GameObject) {
        this.newObjectsIds.push(object.id);
        this.objects.set(object.id, object);
    }

    /**
     * Removes the game object that has the given simulation from this simulation. This will also remove it from the
     * box2d world if it exists inside of it
     * @param id - The id of the object to remove from the simulation
     */
    public destroyGameObject(id: string) {
        if (this.objects.has(id)) {
            this.objects.get(id).destroy();
            this.objects.delete(id);
        }
        // Add the id regardless
        this.deletedObjectIds.push(id);
    }

    /**
     * Process a move update from a client.
     *
     * @param move - An object containing move information.
     */
    public updateMove(move: PlayerMoveUpdate): void {
        const player: Player | undefined = this.objects.get(move.id) as Player;
        if (player !== undefined) {
            player.applyPlayerMoveUpdate(move);
        }
    }

    /**
     * Get the current frame number.
     *
     * @return the current frame number.
     */
    public getFrame(): number {
        return this.frame;
    }

    /**
     * Gets an array of position updates for every object that is in the simulation
     *
     * @return an array of position updates.
     */
    public getPositionUpdates(): IPositionUpdate[] {
        let updates: IPositionUpdate[] = [];
        this.objects.forEach((object: GameObject, id: string) => {
            if (object.sendUpdates) updates.push(object.getPositionUpdate(this.frame))
        });
        return updates;
    }

    /**
     * Maps all of the objects that are in the game now to an object description that describes it
     */
    public getObjectDescriptions(): IObjectDescription[] {
        let descriptions: IObjectDescription[] = [];
        this.objects.forEach((object: GameObject, id: string) => {
            descriptions.push(object.getAsNewObject());
        });
        return descriptions;
    }

    /**
     * Returns true if the simulation has created at least one new object since the last time popNewObjectDescriptions was called
     */
    public hasNewObjectDescriptions(): boolean {
        return this.newObjectsIds.length !== 0;
    }
    /**
     * Maps all of the new objects (since the last time this method was called) to an objects description that describes it
     */
    public popNewObjectDescriptions(): IObjectDescription[] {
        // Get a new object description for every new object id. Filter out undefined objects just in case that objects
        // has been removed, since the simulation should not be expected to check the new object id array every time a object
        // is destroyed
        let newObjectsDescriptions: IObjectDescription[] = this.newObjectsIds.map((id: string) => this.objects.get(id))
            .filter((object: GameObject) => object !== undefined)
            .map((object: GameObject) => object.getAsNewObject());
        this.newObjectsIds = [];
        return newObjectsDescriptions;
    }

    /**
     * Returns true if this simulation has any new deleted object ids since the last time they were popped
     */
    public hasDeletedObjects(): boolean {
        return this.deletedObjectIds.length !== 0;
    }

    /**
     * Pops all deleted ids from the internal array of deleted ids
     */
    public popDeletedObjectIds(): string[] {
        let temp: string[] = this.deletedObjectIds;
        this.deletedObjectIds = [];
        return temp;
    }

    public hasPendingEvents(): boolean {
        return this.events.length !== 0;
    }
}
