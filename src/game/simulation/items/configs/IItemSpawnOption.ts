export interface IItemSpawnOption {
    /**
     * The chance that this spawn option will be used IF a spawn location meets the criteria for this option
     */
    successChance: number;
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
    condition: string;
}