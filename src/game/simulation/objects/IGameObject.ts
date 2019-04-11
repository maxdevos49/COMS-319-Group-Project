import { IPositionUpdate } from "../../../public/javascript/game/models/game/objects/IPositionUpdate";
import { IObjectDescription } from "../../../public/javascript/game/models/game/objects/IObjectDescription";

export interface IGameObject {
	/**
	 * The id of the game object
	 */
    id: string;
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