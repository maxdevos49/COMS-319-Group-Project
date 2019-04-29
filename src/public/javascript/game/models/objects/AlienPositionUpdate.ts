import { IPositionUpdate } from "./IPositionUpdate";

export class AlienPositionUpdate implements IPositionUpdate {
    frame: number;
    id: string;

    /**
     * The new x coordinate of the alien
     */
    x: number;

    /**
     * The new y coordinate of the alien
     */
    y: number;

    /**
     * The new angle of the alien
     */
    angle: number;

    constructor(id: string, frame: number, x: number, y: number, angle: number) {
        this.id = id;
        this.frame = frame;
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}