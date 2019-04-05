import {Player} from "../objects/Player.js";
import {GameScene} from "../scenes/GameScene";
import { PlayerMoveDirection, PlayerMoveUpdate } from "../../models/game/PlayerMoveUpdate.js";

export class UserInput {
    /**
     * A reference to the player that this user input is moving
     */
    public player: Player;
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

    /**
     * Creates a UserInput object that handles input from the user.
     * 
     * @param scene the scene the player is in
     * @param player the player to be moved
     */
    constructor(scene: GameScene, player: Player) {
        this.player = player;

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
            return PlayerMoveDirection.UpRight;
        } else if ((this.keyW.isDown || this.keyUp.isDown) && (this.keyA.isDown || this.keyLeft.isDown)) {     // UP LEFT
            return PlayerMoveDirection.UpLeft;
        } else if ((this.keyS.isDown || this.keyDown.isDown) && (this.keyA.isDown || this.keyLeft.isDown)) {   // DOWN LEFT
            return PlayerMoveDirection.DownLeft;
        } else if ((this.keyS.isDown || this.keyDown.isDown) && (this.keyD.isDown || this.keyRight.isDown)) {  // DOWN RIGHT
            return PlayerMoveDirection.DownRight;
        } else if (this.keyW.isDown || this.keyUp.isDown) {     // UP
            return PlayerMoveDirection.Up;
        } else if (this.keyA.isDown || this.keyLeft.isDown) {   // LEFT
            return PlayerMoveDirection.Left;
        } else if (this.keyS.isDown || this.keyDown.isDown) {   // DOWN
            return PlayerMoveDirection.Down;
        } else if (this.keyD.isDown || this.keyRight.isDown) {  // RIGHT
            return PlayerMoveDirection.Right;
        } else {
            return PlayerMoveDirection.None;
        }
    }

    changeDirection(direction: PlayerMoveDirection): PlayerMoveUpdate {
        return new PlayerMoveUpdate(this.player.id, 0, 0, true, direction);
    }
    
}