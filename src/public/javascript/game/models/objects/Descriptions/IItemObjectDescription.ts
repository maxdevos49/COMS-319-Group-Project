import { IObjectDescription } from "./IObjectDescription";

export interface IITemDescription extends IObjectDescription {

    /**
     * The Item type to determine the rendering
     */
    itemType: ItemType;

    /**
     * The sprite path to use
     */
    sprite: string;

}

export enum ItemType {
    Default,
    SpeedBoost,
}