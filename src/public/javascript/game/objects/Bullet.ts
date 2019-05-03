import { GameObject } from "./GameObject.js";
import { BulletObjectDescription } from "../models/objects/Descriptions/BulletObjectDescription.js";
import { BulletPositionUpdate } from "../models/objects/BulletPositionUpdate.js";
import { SCALE_FACTOR } from "../Game.js";

export class Bullet extends GameObject {
    /**
	 * The id of this player
	 */
    public id: string;
	/**
	 * The id of the game object that owns this bullet
	 */
    public ownerId: string;

	/**
	 * Constructs a new bullet object
	 * @param scene The scene this bullet is to belong to
	 * @param description The description to create the bullet from
	 */
    constructor(scene: Phaser.Scene, description: BulletObjectDescription) {
        super(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR, "sprites", "items/weapons/laser_cannon_bullet");

        scene.physics.world.enable(this);

        this.id = description.id;
        this.ownerId = description.ownerId;
        this.setRotation(description.angle);
    }

    applyUpdate(newUpdate: BulletPositionUpdate): void {
        this.setPosition(newUpdate.x * SCALE_FACTOR, newUpdate.y * SCALE_FACTOR);
    }
}