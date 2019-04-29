import { GameObject } from "./GameObject";
import { GameSimulation } from "../GameSimulation";
import { GameObjectType } from "../../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { WorldBorderObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/WorldBorderObjectDescription";
import { WorldBorderPositionUpdate } from "../../../public/javascript/game/models/objects/WorldBorderPositionUpdate";

export class WorldBorder extends GameObject {

    public static moveSpeed: number = 5;

    /**
     * The x coordinate that this border is centered on
     */
    centeredX: number;

    /**
     * The y coordinate that this border is centered on
     */
    centeredY: number;

    /**
     * The radius that this world border starts with
     */
    beginRadius: number;
    /**
     * The radius that this world border will end with
     */
    endRadius: number;

    /**
     * The current radius of this world border
     */
    curRadius: number;

    constructor(id: string, simulation: GameSimulation, centerX: number, centerY: number, beginRadius: number, endRadius: number) {
        super(id, GameObjectType.WorldBorder, simulation);
        this.centeredX = centerX;
        this.centeredY = centerY;
        this.beginRadius = beginRadius;
        this.endRadius = endRadius;
        this.curRadius = beginRadius;
    }

    getAsNewObject(): WorldBorderObjectDescription {
        return new WorldBorderObjectDescription(this.id, this.centeredX, this.centeredX, this.curRadius);
    }

    getPositionUpdate(frame: number): WorldBorderPositionUpdate {
        return new WorldBorderPositionUpdate(this.id, frame, this.curRadius);
    }

}