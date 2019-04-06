/**
 * Defines an update that the client sends to the server containing the implementation interpretation of what the player
 * wants to do in the next frame
 */
export class PlayerMoveUpdate {
    /**
     * The id of the player this move update is for
     */
    public id: string;
    /**
     * The frame this update is for
     */
    public frame: number;
    /**
     * The angle in radians that the player is facing
     */
    public facing: number;
    /**
     * Whether the facing direction of the player should be changed to reflect the facing property
     */
    public updateFacing: boolean;
    /**
     * The direction the player is moving or the None enum value if the player is not moving
     */
    public moveDirection: PlayerMoveDirection;

    /**
     * Constructs a new player move update object
     * @param id The id of the player this move update is for
     * @param frame The frame this update is for
     * @param facing The angle in radians that the player is facing
     * @param updateFacing Whether the facing direction of the player should be changed to reflect the facing property
     * @param moveDirection  The direction the player is moving or the None enum value if the player is not moving
     */
    constructor(id: string, frame: number, facing: number, updateFacing: boolean, moveDirection: PlayerMoveDirection) {
        this.id = id;
        this.frame = frame;
        this.facing = facing;
        this.updateFacing = updateFacing;
        this.moveDirection = moveDirection;
    }
}

/**
 * Enum which provides the directions the player can move. The numerical value of evey element in the num corresponds
 * to the angle the direction is when the positive x-axis is defined to be towards the players right (relative to the
 * direction the player is facing) and the positive y-axis is forwards.
 *
 * The special None value has a undefined numerical value
 */
export enum PlayerMoveDirection {
    Right = 0,
    UpRight = Math.PI / 4,
    Up = Math.PI / 2,
    UpLeft = (3 * Math.PI) / 4,
    Left = Math.PI,
    DownLeft = (5 * Math.PI) / 4,
    Down = (3 * Math.PI) / 2,
    DownRight = (7 * Math.PI) / 4,
    None = NaN
}