import { IPositionUpdate } from "./IPositionUpdate.js";

export class WorldBorderPositionUpdate implements IPositionUpdate {
    frame: number;
    id: string;

    /**
     * The current radius of the border
     */
    curRadius: number;

    constructor(id: string, frame: number, curRadius: number) {
        this.id = id;
        this.frame = frame;
        this.curRadius = curRadius;
    }
}