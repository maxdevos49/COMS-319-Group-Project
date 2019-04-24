import { IPositionUpdate } from "./IPositionUpdate";

export class ItemPositionUpdate implements IPositionUpdate {

    /**
     * The id of the Item
     */
    public id: string;

    /**
     * The frame this update is for
     */
    public frame: number;

	/**
	 * The x coordinate of the position update
	 */
    public x: number;

	/**
	 * The y coordinate of the position update
	 */
    public y: number;

    /**
     * Constructs a Item position update
     * @param givenId
     * @param givenFrame
     * @param givenX
     * @param givenY
     */
    constructor(givenId: string, givenFrame: number, givenX: number, givenY: number, ) {
        this.id = givenId;
        this.frame = givenFrame;
        this.x = givenX;
        this.y = givenY;
    }

}