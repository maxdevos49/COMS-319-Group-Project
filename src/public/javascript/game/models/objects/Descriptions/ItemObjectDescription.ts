import { GameObjectType } from "./IObjectDescription";
import { ItemType, IITemDescription } from "./IItemObjectDescription";

export class ItemObjectDescription implements IITemDescription {

    /**
     * Id of item
     */
    id: string;

    /**
     * Type of Game Object
     */
    type: GameObjectType;

    /**
     * Type of item
     */
    itemType: ItemType;

	/**
	 * The position of the item horizontaly
	 */
    x: number;

    /**
     * The position of the item vertically
     */
    y: number;

    constructor(givenId: string, givenX: number, givenY: number, givenItemType: ItemType) {
        //properties
        this.id = givenId;
        this.x = givenX;
        this.y = givenY;
        this.type = GameObjectType.Item;
        this.itemType = givenItemType;
    }

}