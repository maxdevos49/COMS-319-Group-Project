import { IPositionUpdate } from "../models/game/objects/IPositionUpdate.js";

export abstract class GameObject extends Phaser.GameObjects.Sprite {
    /**
     * The id of this game object
     */
	id: string;

    /**
     * Applies the given position update to the game object. Handlers of this method can assume that the update passed
     * to it is of the type needed by the game object implementing this
     * @param newUpdate The new update for this game object
     */
	abstract applyUpdate(newUpdate: IPositionUpdate): void;
}