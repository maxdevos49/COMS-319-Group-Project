import { ItemType } from "../../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";
import { IItemConfig } from "./configs/IItemConfig";

export abstract class InventoryItem {

    /**
     * The id of this item
     */
    id: string;

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
     * @param id The id to assign to this item
     * @param config The item config to use
     * @param type The type of the item that is extending this
     */
    protected constructor(id: string, config: IItemConfig, type: ItemType) {
        this.id = id;
        this.itemType = type;
        this.name = config.name;
        this.tip = config.tooltip;
        this.groundedItemSprite = config.groundedItemSprite;
        this.inventoryItemSprite = config.inventoryItemSprite;
    }
}