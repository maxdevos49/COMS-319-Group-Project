export interface IPositionUpdate {
    /**
     * The id of the player this move update is for
     */
    id: string;
    /**
     * The frame this update is for
     */
    frame: number;
	/**
	 * The x coordinate of the position update
	 */
	x: number;
	/**
	 * The y coordinate of the position update
	 */
    y: number;
}