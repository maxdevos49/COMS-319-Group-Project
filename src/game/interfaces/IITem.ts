import { ItemType } from "../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";

export interface IITem {
    /**
     * The id of the item
     */
    id: string;

    /**
     * The item type
     */
    itemType: ItemType

    /**
     * The sprite
     */
    sprite: string;
}