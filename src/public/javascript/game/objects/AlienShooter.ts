import { GameObject } from "./GameObject.js";
import { AlienPositionUpdate } from "../models/objects/AlienPositionUpdate.js";
import { GameScene } from "../scenes/GameScene.js";
import { SCALE_FACTOR } from "../Game.js";
import { AlienObjectDescription } from "../models/objects/Descriptions/AlienObjectDescription.js";

export class AlienShooter extends GameObject {
    private container: Phaser.GameObjects.Container;
    private torso: Phaser.GameObjects.Sprite;
    private head: Phaser.GameObjects.Sprite;
    private arm_r: Phaser.GameObjects.Sprite;
    private arm_l: Phaser.GameObjects.Sprite;

    /**
     * Registers the animations used by player objects
     * @param animationManager The animation manager to register the animations into
     */
    public static createAnimations(animationManager: Phaser.Animations.AnimationManager) {
        // animationManager.create({
        //     key: "objects/aliens/shooter/still",
        //     frames: [
        //         { key: "sprites", frame: 'objects/aliens/shooter/still/1' }
        //     ],
        //     frameRate: 1,
        //     repeat: -1
        // });
    }

    /**
     * Creates a new player in the given scene
     * @param scene The scene that the player should be created in
     * @param description The description to build the object from
     */
    constructor(scene: GameScene, description: AlienObjectDescription) {
        super(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR, "sprites", "items/weapons/ion_repeater_bullet");

        this.torso = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", "objects/aliens/alien_1/torso");
        this.head = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", "objects/aliens/alien_1/head");
        this.arm_r = new Phaser.GameObjects.Sprite(scene, 85, -70, "sprites", "objects/aliens/alien_1/arm_r");
        this.arm_l = new Phaser.GameObjects.Sprite(scene, -85, -70, "sprites", "objects/aliens/alien_1/arm_l");

        this.container = new Phaser.GameObjects.Container(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR);

        this.container.add(this.arm_r);
        this.container.add(this.arm_l);
        this.container.add(this.torso);
        this.container.add(this.head);

        scene.add.existing(this);
        scene.add.existing(this.container);

        this.setScale(0.25, 0.25);
        this.container.setScale(0.25, 0.25);

        this.id = description.id;
        this.setRotation(description.angle);
    }

    applyUpdate(newUpdate: AlienPositionUpdate): void {
        this.setPosition(newUpdate.x * SCALE_FACTOR, newUpdate.y * SCALE_FACTOR);
        this.setRotation(newUpdate.angle);

        this.container.setPosition(newUpdate.x * SCALE_FACTOR, newUpdate.y * SCALE_FACTOR);
        this.container.setRotation(newUpdate.angle + Math.PI / 2);
    }

    destroy(): void {
        this.container.destroy();
        super.destroy();
    }
}