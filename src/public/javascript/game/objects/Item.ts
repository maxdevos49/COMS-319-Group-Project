import { GameObject } from "./GameObject.js";
import { SCALE_FACTOR } from "../Game.js";
import { ItemObjectDescription } from "../models/objects/Descriptions/ItemObjectDescription.js";
import { ItemPositionUpdate } from "../models/objects/ItemPositionUpdate.js";

export class Item extends GameObject {
	/**
	 * Constructs a new bullet object
	 * @param givenScene The scene this bullet is to belong to
	 * @param givenDescription The description to create the bullet from
	 */
    constructor(givenScene: Phaser.Scene, givenDescription: ItemObjectDescription) {
        super(givenScene, givenDescription.x * SCALE_FACTOR, givenDescription.y * SCALE_FACTOR, givenDescription.sprite);
        console.log(givenDescription.x, givenDescription.y, givenDescription.sprite);
        givenScene.physics.world.enable(this);

        this.id = givenDescription.id;
    }

    /**
     * Applies a ItemPositionUpdate
     * @param givenUpdate
     */
    public applyUpdate(givenUpdate: ItemPositionUpdate): void {
        this.setPosition(givenUpdate.x * SCALE_FACTOR, givenUpdate.y * SCALE_FACTOR);
    }
}