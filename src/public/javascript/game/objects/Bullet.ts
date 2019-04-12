import { GameObject } from "./GameObject.js";
import { BulletObjectDescription } from "../../models/game/objects/BulletObjectDescription.js";
import { BulletPositionUpdate } from "../../models/game/objects/BulletPositionUpdate.js";
import { SCALE_FACTOR } from "../Game.js";

export class Bullet extends GameObject {
	/**
	 * Registers the animations used by bullet objects
	 * @param animationManager The animation manager to register the animations into
	 */
	public static createAnimations(animationManager: Phaser.Animations.AnimationManager) {
		console.log(
			animationManager.create({
				key: "objects/bullet/orb",
				frames: [
					{key: "sprites", frame: 'objects/bullet/orb/1'},
					{key: "sprites", frame: 'objects/bullet/orb/2'},
					{key: "sprites", frame: 'objects/bullet/orb/3'},
					{key: "sprites", frame: 'objects/bullet/orb/2'}
				],
				frameRate: 10,
				repeat: -1
			}));
	}

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
		super(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR, "sprites");
		scene.physics.world.enable(this);
		this.play("objects/bullet/orb");

		this.id = description.id;
		this.ownerId = description.ownerId;
		this.setRotation(description.angle);
	}

	applyUpdate(newUpdate: BulletPositionUpdate): void {
		this.setPosition(newUpdate.x * SCALE_FACTOR, newUpdate.y * SCALE_FACTOR);
	}
}