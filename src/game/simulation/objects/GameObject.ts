import { GameSimulation } from "../GameSimulation";
import { GameObjectType, IObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { IPositionUpdate } from "../../../public/javascript/game/models/objects/IPositionUpdate";

export abstract class GameObject {
	/**
	 * The id of the game object
	 */
    id: string;

	/**
	 * The type of the game objects
	 */
    type: GameObjectType;

	/**
	 * This simulation which this game object belongs to
	 */
    simulation: GameSimulation;

    /**
     * Specifies whether position updates should be send for this object
     */
    sendUpdates: boolean;


    /**
     * Constructs a new game object that belongs to the given simulation
     * @param id
     * @param type
     * @param simulation The simulation this object belongs to
     * @param sendUpdates Whether position updates should be send
     */
    protected constructor(id: string, type: GameObjectType, simulation: GameSimulation, sendUpdates: boolean = true) {
        this.id = id;
        this.type = type;
        this.simulation = simulation;
        this.sendUpdates = sendUpdates;
    }

	/**
	 * Destroys this game object from the box2d world
	 */
    destroy(): void { /* Do nothing */ };

	/**
	 * Gets the PositionUpdate that describes the current state of the game object
	 * @param frame The frame for the position update to be made
	 */
    abstract getPositionUpdate(frame: number): IPositionUpdate;

	/**
	 * Gets the NewObject that describes the current state of the game object
	 */
    abstract getAsNewObject(): IObjectDescription;

	/**
	 * Called when one of the fixtures this body owns has collided with another objects
	 * @param object The object one of the fixtures of this object has collided with
	 */
    collideWith(object: IObjectDescription): void { /* do nothing */ };

	/**
	 * Called once per physics frame before a step in the engine is processed
	 */
    update(): void { /* do nothing */ };
}