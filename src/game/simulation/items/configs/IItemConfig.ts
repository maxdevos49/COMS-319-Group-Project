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
     * The rarity of this item from 0 to 100 with 0 never being generated and 100 being completely common
     */
    rarity: number;
    /**
     * The name of the sprite that is used when the weapon is on the ground
     */
    groundedItemSprite: string;
    /**
     * The name of the sprite that is used when the weapon is in the inventory
     */
    inventoryItemSprite: string;
    /**
     * One of the following:
     * Name of tile
     * Tile group/name prefixed by '@' sign which the item must be on
     * Tile name prefixed by '#' sign which the item must be near
     * Tile group prefixed by '#@' signs which the item must be near
     * or a combination of the above delimited by a '&' sign of which all conditions must be met
     *
     * which determines where the item can be placed
     */
    generatedNextTo: string;
}