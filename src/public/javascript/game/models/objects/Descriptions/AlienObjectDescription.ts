import { GameObjectType, IObjectDescription } from "./IObjectDescription";

export class AlienObjectDescription implements IObjectDescription {
    id: string;
    type: GameObjectType;

    /**
     * The x coordinate of this alien
     */
    x: number;

    /**
     * The y coordinate of this alien
     */
    y: number;

    /**
     * The angle of this alien
     */
    angle: number;

    constructor(id: string, x: number, y: number, angle: number) {
        this.id = id;
        this.type = GameObjectType.Alien;
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}