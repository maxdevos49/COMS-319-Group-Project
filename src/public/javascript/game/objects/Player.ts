import {GameObject} from "./GameObject.js";
import {PlayerPositionUpdate} from "../../models/game/objects/PlayerPositionUpdate.js";
import { PlayerMoveUpdate } from "../../models/game/PlayerMoveUpdate.js";
import {PlayerObjectDescription} from "../../models/game/objects/PlayerObjectDescription.js";

export class Player extends GameObject {
    /**
     * Registers the animations used by player objects
     * @param animationManager The animation manager to register the animations into
     */
    public static createAnimations(animationManager: Phaser.Animations.AnimationManager) {
        console.log(
        animationManager.create({
            key: "objects/player/walking",
            frames: [
                {key: "sprites", frame: 'objects/player/walking/1'},
                {key: "sprites", frame: 'objects/player/walking/2'}
            ],
            frameRate: 2,
            repeat: -1
        }));
    }
    /**
     * The id of this player
     */
    public id: string;
    /**
     * Player move update to be sent to the server.
     */
    public moveUpdate: PlayerMoveUpdate;

	/**
	 * Creates a new player in the given scene
	 * @param scene The scene that the player should be created in
	 * @param description The description to build the object from
	 */
    constructor(scene: Phaser.Scene, description: PlayerObjectDescription) {
        super(scene, description.x, description.y, "sprites");
        scene.physics.world.enable(this);
        this.play("objects/player/walking");

        this.id = description.id;
        this.setRotation(description.facing);
    }

    applyUpdate(newUpdate: PlayerPositionUpdate): void {
        this.setPosition(newUpdate.x, newUpdate.y);
        this.setRotation(newUpdate.facing);
    }
}