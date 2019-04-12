import {IPositionUpdate} from "../../../public/javascript/models/game/objects/IPositionUpdate";
import { GameObjectType, IObjectDescription } from "../../../public/javascript/models/game/objects/IObjectDescription";
import { b2World } from "../../../../lib/box2d-physics-engine/Dynamics/b2World";

export interface IGameObject {
	/**
	 * The id of the game object
	 */
	id: string;
	/**
	 * The type of the game objects
	 */
	type: GameObjectType;

	/**
	 * Removes this game object from the world
	 * @param world The world to remove the game object from which should correspond to the one it was created in
	 */
	deconstruct(world: b2World): void;

	/**
	 * Gets the PositionUpdate that describes the current state of the game object
	 * @param frame The frame for the position update to be made
	 */
	getPositionUpdate(frame: number): IPositionUpdate;

	/**
	 * Gets the NewObject that describes the current state of the game object
	 */
	getAsNewObject(): IObjectDescription;
}