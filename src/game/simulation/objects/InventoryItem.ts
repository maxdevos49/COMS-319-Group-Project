import { ItemType } from "../../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";

export abstract class InventoryItem {

    /**
     * The type of item
     */
    itemType: ItemType

    /**
     * The name of the item
     */
    name: string;

    /**
     * The tip for the tooltip of the item
     */
    tip?: string;

    /**
     * The sprite key for the client to use
     */
    sprite: string;

    /**
     * Constructs an inventory item
     * @param givenItemType
     * @param givenSprite
     * @param givenName
     * @param givenTip
     */
    constructor(givenItemType: ItemType, givenSprite: string, givenName: string, givenTip?: string) {

        //properties
        this.itemType = givenItemType;
        this.sprite = givenSprite;
        this.name = givenName;
        this.tip = givenTip;
    }

    //TODO a few more methods down here for things TBD

}