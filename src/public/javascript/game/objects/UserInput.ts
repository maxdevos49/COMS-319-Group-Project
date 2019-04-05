import {Player} from "../objects/Player.js";
import {GameScene} from "../scenes/GameScene";
import { PlayerMoveDirection } from "../../models/game/PlayerMoveUpdate.js";
import { RIGHT } from "phaser";

export class UserInput {
    /**
     * A reference to the player that this user input is moving
     */
    private clientPlayer: Player;
    /** 
     * A reference to the GameScene this player is a part of
     */
    private scene: GameScene;
    /**
     * The W key
     */
    private keyW: Phaser.Input.Keyboard.Key;
    /**
     * The A key
     */
    private keyA: Phaser.Input.Keyboard.Key;
    /**
     * The S key
     */
    private keyS: Phaser.Input.Keyboard.Key;
    /**
     * The D key
     */
    private keyD: Phaser.Input.Keyboard.Key;
    /**
     * The UP arrow key
     */
    private keyUp: Phaser.Input.Keyboard.Key;
    /**
     * The LEFT arrow key
     */
    private keyLeft: Phaser.Input.Keyboard.Key;
    /**
     * The DOWN arrow key
     */
    private keyDown: Phaser.Input.Keyboard.Key;
    /**
     * The RIGHT key
     */
    private keyRight: Phaser.Input.Keyboard.Key;


    constructor(scene: GameScene) {
        this.scene = scene;
        
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    checkDirection(): PlayerMoveDirection {
        if ((this.keyW.isDown || this.keyUp.isDown) && (this.keyD.isDown || this.keyRight.isDown)) {           // UP RIGHT
            return Math.PI / 4;
        } else if ((this.keyW.isDown || this.keyUp.isDown) && (this.keyA.isDown || this.keyLeft.isDown)) {     // UP LEFT
            return (3 * Math.PI) / 4;
        } else if ((this.keyS.isDown || this.keyDown.isDown) && (this.keyA.isDown || this.keyLeft.isDown)) {   // DOWN LEFT
            return (5 * Math.PI) / 4;
        } else if ((this.keyS.isDown || this.keyDown.isDown) && (this.keyD.isDown || this.keyRight.isDown)) {  // DOWN RIGHT
            return (7 * Math.PI) / 4;
        } else if (this.keyW.isDown || this.keyUp.isDown) {     // UP
            return Math.PI / 2;
        } else if (this.keyA.isDown || this.keyLeft.isDown) {   // LEFT
            return Math.PI;
        } else if (this.keyS.isDown || this.keyDown.isDown) {   // DOWN
            return (3 * Math.PI) / 2;
        } else if (this.keyD.isDown || this.keyRight.isDown) {  // RIGHT
            return 0;
        } else {
            return NaN;
        }
    }
    
}