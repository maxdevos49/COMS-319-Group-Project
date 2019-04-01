import {PositionUpdate} from "../../models/game/PositionUpdate";

export interface GameObject {
    /**
     * The id of this game object
     */
    id: string;

    /**
     * Applies the given position update to the game object. Handlers of this method can assume that the update passed
     * to it is of the type needed by the game object implementing this
     * @param newUpdate The new update for this game object
     */
    applyUpdate(newUpdate: PositionUpdate): void;
}