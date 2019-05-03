import { GameObject } from "./GameObject.js";
import { SCALE_FACTOR } from "../Game.js";
import { PlayerObjectDescription } from "../models/objects/Descriptions/PlayerObjectDescription.js";
import { PlayerPositionUpdate } from "../models/objects/PlayerPositionUpdate.js";
import { PlayerMoveUpdate } from "../models/PlayerMoveUpdate.js";
import { GameScene } from "../scenes/GameScene.js";

export class Player extends GameObject {
    private timeline: Phaser.Tweens.Timeline;
    private container: Phaser.GameObjects.Container;
    private torso: Phaser.GameObjects.Sprite;
    private head: Phaser.GameObjects.Sprite;
    private arm_r: Phaser.GameObjects.Sprite;
    private arm_l: Phaser.GameObjects.Sprite;
    private leg_r: Phaser.GameObjects.Sprite;
    private leg_l: Phaser.GameObjects.Sprite;
    private weapon: Phaser.GameObjects.Sprite;
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
        super(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR, "sprites", "items/weapons/ion_repeater_bullet");

        // Randomly choose the color and type for the player's character
        let rand: number = Math.floor((Math.random() * 3) + 1);
        let color: string;

        switch(rand) {
            case 1:
                color = "blue";
                break;
            case 2:
                color = "red";
                break;
            case 3:
                color = "green";
                break;
        }

        rand = Math.floor((Math.random() * 3) + 1);
        let type: string;

        switch(rand) {
            case 1:
                type = "light";
                break;
            case 2:
                type = "light";
                break;
            case 3:
                type = "light";
                break;
        }
        
        // Assign sprites based on the color and type determined above
        if (type === "heavy") {
            this.torso = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", `objects/soldiers/${color}/heavy/torso`);
            this.head = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", `objects/soldiers/${color}/heavy/head`);
            this.arm_r = new Phaser.GameObjects.Sprite(scene, 85, -70, "sprites", `objects/soldiers/${color}/heavy/arm_r`);
            this.arm_l = new Phaser.GameObjects.Sprite(scene, -85, -70, "sprites", `objects/soldiers/${color}/heavy/arm_l`);
            this.leg_r = new Phaser.GameObjects.Sprite(scene, 42, -25, "sprites", `objects/soldiers/${color}/heavy/leg_r`);
            this.leg_l = new Phaser.GameObjects.Sprite(scene, -42, -25, "sprites", `objects/soldiers/${color}/heavy/leg_l`);
            this.backpack = new Phaser.GameObjects.Sprite(scene, 0, 90, "sprites", `objects/soldiers/${color}/heavy/backpack`);
            if (color === "green") { 
                this.weapon = new Phaser.GameObjects.Sprite(scene, -80, -115, "sprites", `objects/soldiers/${color}/heavy/weapon`); 
            }else { 
                this.weapon = new Phaser.GameObjects.Sprite(scene, 80, -115, "sprites", `objects/soldiers/${color}/heavy/weapon`); 
            }
        } else {
            this.torso = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", `objects/soldiers/${color}/${type}/torso`);
            this.head = new Phaser.GameObjects.Sprite(scene, 0, 0, "sprites", `objects/soldiers/${color}/${type}/head`);
            this.arm_r = new Phaser.GameObjects.Sprite(scene, 70, -55, "sprites", `objects/soldiers/${color}/${type}/arm_r`);
            this.arm_l = new Phaser.GameObjects.Sprite(scene, -70, -55, "sprites", `objects/soldiers/${color}/${type}/arm_l`);
            this.leg_r = new Phaser.GameObjects.Sprite(scene, 33, -25, "sprites", `objects/soldiers/${color}/${type}/leg_r`);
            this.leg_l = new Phaser.GameObjects.Sprite(scene, -33, -25, "sprites", `objects/soldiers/${color}/${type}/leg_l`);
            if (color === "green") {
                this.weapon = new Phaser.GameObjects.Sprite(scene, -70, -95, "sprites", `objects/soldiers/${color}/${type}/weapon`);
            } else { this.weapon = new Phaser.GameObjects.Sprite(scene, 70, -95, "sprites", `objects/soldiers/${color}/${type}/weapon`); 
            }
            this.leg_r.setScale(0.75, 0.75);
            this.leg_l.setScale(0.75, 0.75);
        }

        // Create container for sprites
        this.container = new Phaser.GameObjects.Container(scene, description.x * SCALE_FACTOR, description.y * SCALE_FACTOR);

        // Add the sprites to the container
        this.container.add(this.leg_r);
        this.container.add(this.leg_l);
        this.container.add(this.arm_r);
        this.container.add(this.arm_l);
        this.container.add(this.weapon);
        this.container.add(this.torso);
        if (type === "heavy") { this.container.add(this.backpack); }
        this.container.add(this.head);

        scene.add.existing(this);
        scene.add.existing(this.container);

        this.setScale(0.5, 0.5);
        this.container.setScale(0.5, 0.5);

        // Setup the animations
        this.setupTweenTimeline(scene);

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

    private setupTweenTimeline(scene: GameScene): void {
        this.timeline = scene.tweens.timeline({
            loop: -1,
        
            tweens: [
                {
                    targets: this.leg_r,
                    y: '-=10',
                    ease: 'Quadratic',
                    useFrames: true,
                    duration: 12,
                    repeat: -1,
                    yoyo: true,
                },
                {
                    targets: this.leg_l,
                    y: '-=10',
                    ease: 'Quadratic',
                    useFrames: true,
                    duration: 12,
                    repeat: -1,
                    yoyo: true,
                    offset: 12
                }
            ]
        });
    }

    destroy(): void {
        this.container.destroy();
        super.destroy();
    }
}