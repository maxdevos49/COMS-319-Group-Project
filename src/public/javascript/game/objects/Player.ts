import { GameObject } from "./GameObject.js";
import { SCALE_FACTOR } from "../Game.js";
import { PlayerObjectDescription } from "../models/objects/Descriptions/PlayerObjectDescription.js";
import { PlayerPositionUpdate } from "../models/objects/PlayerPositionUpdate.js";
import { PlayerMoveUpdate } from "../models/PlayerMoveUpdate.js";
import { GameScene } from "../scenes/GameScene.js";

export class Player extends GameObject {
    private container: Phaser.GameObjects.Container;
    private torso: Phaser.GameObjects.Sprite;
    private head: Phaser.GameObjects.Sprite;
    private arm_r: Phaser.GameObjects.Sprite;
    private arm_l: Phaser.GameObjects.Sprite;
    private leg_r: Phaser.GameObjects.Sprite;
    private leg_l: Phaser.GameObjects.Sprite;
    private backpack: Phaser.GameObjects.Sprite;


    /**
     * Registers the animations used by player objects
     * @param animationManager The animation manager to register the animations into
     */
    public static createAnimations(animationManager: Phaser.Animations.AnimationManager) {
        // animationManager.create({
        //     key: "objects/player/walking",
        //     frames: [
        //         { key: "sprites", frame: 'objects/player/walking/1' },
        //         { key: "sprites", frame: 'objects/player/walking/2' }
        //     ],
        //     frameRate: 2,
        //     repeat: -1
        // });
    }

	/**
	 * Creates a new player in the given scene
	 * @param scene The scene that the player should be created in
	 * @param description The description to build the object from
	 */
    constructor(scene: GameScene, description: PlayerObjectDescription) {
        super(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR, "sprites", "items/ion_repeater_bullet");
        
        this.torso = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", "objects/soldiers/blue/heavy/torso");
        this.head = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", "objects/soldiers/blue/heavy/head");
        this.arm_r = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", "objects/soldiers/blue/heavy/arm_r");
        this.arm_l = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", "objects/soldiers/blue/heavy/arm_l");
        this.leg_r = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", "objects/soldiers/blue/heavy/leg_r");
        this.leg_l = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", "objects/soldiers/blue/heavy/leg_l");
        this.backpack = new Phaser.GameObjects.Sprite(scene, 0, 85, "sprites", "objects/soldiers/blue/heavy/backpack");

        this.container = new Phaser.GameObjects.Container(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR);

        this.container.add(this.leg_r);
        this.container.add(this.leg_l);
        this.container.add(this.arm_r);
        this.container.add(this.arm_l);
        this.container.add(this.torso);
        this.container.add(this.backpack);
        this.container.add(this.head);

        scene.add.existing(this);
        scene.add.existing(this.container);

        this.id = description.id;
        this.setRotation(description.facing + Math.PI / 2);

        //physics
        scene.physics.world.enable(this);//needed for camera movement
    }

    applyUpdate(newUpdate: PlayerPositionUpdate): void {
        this.setPosition(newUpdate.x * SCALE_FACTOR, newUpdate.y * SCALE_FACTOR);
        this.setRotation(newUpdate.facing + Math.PI / 2);

        this.container.setPosition(newUpdate.x * SCALE_FACTOR, newUpdate.y * SCALE_FACTOR);
        this.container.setRotation(newUpdate.facing + Math.PI / 2);
    }
}