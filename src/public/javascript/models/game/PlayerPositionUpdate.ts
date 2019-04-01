/**
 * Defines an update that the server sends to the client informing them where every player in the game is
 */
export class PlayerPositionUpdate {
    /**
     * The id of the player this move update is for
     */
    public id: string;
    /**
     * The frame this update is for
     */
    public frame: number;
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
}

enum PlayerActionState {
    Still,
    Walking
}