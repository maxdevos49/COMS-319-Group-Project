import { ItemType } from "../../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";
import { IItemConfig } from "./configs/IItemConfig";

export abstract class InventoryItem {

    /**
     * The type of item
     */
    itemType: ItemType;

    /**
     * The name of the item
     */
    name: string;

    /**
     * The tip for the tooltip of the item
     */
    tip?: string;

    /**
     * The name of the sprite for the client to use when the item is on the ground
     */
    groundedItemSprite: string;

    /**
     * The name of the sprite for the client to use when the item is in the client's inventory
     */
    inventoryItemSprite: string;

    /**
     * Constructs a new item from the item config
     * @param config The item config to use
     */
    protected constructor(config: IItemConfig) {
        this.itemType = (<any>ItemType)[config.type];
        this.name = config.name;
        this.tip = config.tooltip;
        this.groundedItemSprite = config.groundedItemSprite;
        this.inventoryItemSprite = config.inventoryItemSprite;
    }
}