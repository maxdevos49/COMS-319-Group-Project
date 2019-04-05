import {GameObject} from "./GameObject";
import {PlayerPositionUpdate} from "../../models/game/PlayerPositionUpdate";
import { PlayerMoveUpdate } from "../../models/game/PlayerMoveUpdate";

export class Player extends Phaser.GameObjects.Sprite implements GameObject {
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
     * @param x The x coordinate the player should be created at
     * @param y The y coordinate the player should be created at
     * @param id The id of the player to be created
     */
    constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
        super(scene, x, y, "sprites");
        scene.physics.world.enable(this);
        this.play("objects/player/walking");
        this.id =id;
    }

    applyUpdate(newUpdate: PlayerPositionUpdate): void {
        this.setPosition(newUpdate.x, newUpdate.y);
        this.setRotation(newUpdate.facing);
    }
}