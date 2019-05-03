import { IItemSpawnOption } from "./IItemSpawnOption";

export interface IItemConfig {
    /**
     * The name of this item
     */
    name: string;
    /**
     * The tooltip for this item
     */
    tooltip?: string;
    /**
     * The type of this item, such as "weapon"
     */
    type: string;
    /**
     * The minimum number of this item that can be placed on the map (note that this might be ignored if to many attempts
     * are made to place this item)
     */
    minimumNumberOnMap: number;
    /**
     * The maximum number of this item that can be placed on the map
     */
    maximumNumberOnMap: number
    /**
     * The name of the sprite that is used when the weapon is on the ground
     */
    groundedItemSprite: string;
    /**
     * The name of the sprite that is used when the weapon is in the inventory
     */
    inventoryItemSprite: string;
    /**
     * An array of the possible ways this item can be spawned
     */
    spawnOptions: IItemSpawnOption[];
}