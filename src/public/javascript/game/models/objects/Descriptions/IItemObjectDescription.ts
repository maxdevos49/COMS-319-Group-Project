import { IObjectDescription } from "./IObjectDescription";

export interface IITemDescription extends IObjectDescription {

    itemType: ItemType;

}

export enum ItemType {
    Default,
    SpeedBoost,
}