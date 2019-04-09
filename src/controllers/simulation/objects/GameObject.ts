import {PositionUpdate} from "../../../public/javascript/models/game/objects/PositionUpdate";
import {ObjectDescription} from "../../../public/javascript/models/game/objects/ObjectDescription";

export interface GameObject {
	/**
	 * Gets the PositionUpdate that describes the current state of the game object
	 * @param frame The frame for the position update to be made
	 */
	getPositionUpdate(frame: number): PositionUpdate;

	/**
	 * Gets the NewObject that describes the current state of the game object
	 */
	getAsNewObject(): ObjectDescription;
}