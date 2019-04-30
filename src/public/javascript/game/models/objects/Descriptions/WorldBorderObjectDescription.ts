import { GameObjectType, IObjectDescription } from "./IObjectDescription.js";

export class WorldBorderObjectDescription implements IObjectDescription {
    id: string;
    type: GameObjectType;

    /**
     * The x coordinate of the center of the border
     */
    centeredX: number;
    /**
     * The y coordinate of the center of the border
     */
    centeredY: number;

    /**
     * The current radius of the border
     */
    curRadius: number;

    constructor(id: string, centeredX: number, centeredY: number, curRadius: number) {
        this.id = id;
        this.type = GameObjectType.WorldBorder;
        this.centeredX = centeredX;
        this.centeredY = centeredY;
        this.curRadius = curRadius;
    }
}