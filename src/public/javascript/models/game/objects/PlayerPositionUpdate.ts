/**
 * Defines an update that the server sends to the client informing them where every player in the game is
 */
import {IPositionUpdate} from "./IPositionUpdate.js";

export class PlayerPositionUpdate implements IPositionUpdate {
    frame: number;
    id: string;
    /**
     * The x coordinate of the player
     */
    public x: number;
    /**
     * The y coordinate of the player
     */
    public y: number;
    /**
     * The rotation of the player in radians
     */
    public facing: number;
    /**
     * What the player is currently doing
     */
    public state: PlayerActionState;

    /**
     * Constructs a new PlayerPositionUpdate with the given properties
     * @param frame The fame this update is for
     * @param id The id of the player this update is for
     * @param x The new x coordinate of the player
     * @param y The new y coordinate of the player
     * @param facing The angle the player is facing in radians
     * @param state What the player is currently doing
     */
    constructor(frame: number, id: string, x: number, y: number, facing: number, state: PlayerActionState) {
        this.frame = frame;
        this.id = id;
        this.x = x;
        this.y = y;
        this.facing = facing;
        this.state = state;
    }

}

export enum PlayerActionState {
    Still,
    Walking
}