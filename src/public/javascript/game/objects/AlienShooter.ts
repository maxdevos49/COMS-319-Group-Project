import { GameObject } from "./GameObject.js";
import { AlienPositionUpdate } from "../models/objects/AlienPositionUpdate.js";
import { GameScene } from "../scenes/GameScene.js";
import { SCALE_FACTOR } from "../Game.js";
import { AlienObjectDescription } from "../models/objects/Descriptions/AlienObjectDescription.js";

export class AlienShooter extends GameObject {
    /**
     * Registers the animations used by player objects
     * @param animationManager The animation manager to register the animations into
     */
    public static createAnimations(animationManager: Phaser.Animations.AnimationManager) {
        animationManager.create({
            key: "objects/aliens/shooter/still",
            frames: [
                { key: "sprites", frame: 'objects/aliens/shooter/still/1' }
            ],
            frameRate: 1,
            repeat: -1
        });
    }

    /**
     * Creates a new player in the given scene
     * @param scene The scene that the player should be created in
     * @param description The description to build the object from
     */
    constructor(scene: GameScene, description: AlienObjectDescription) {
        super(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR, "sprites");
        this.play("objects/aliens/shooter/still");

        this.id = description.id;
        this.setRotation(description.angle);

        this.setScale(0.25, 0.25);
    }

    applyUpdate(newUpdate: AlienPositionUpdate): void {
        this.x = newUpdate.x * SCALE_FACTOR;
        this.y = newUpdate.y * SCALE_FACTOR;
        this.setRotation(newUpdate.angle);
    }

}