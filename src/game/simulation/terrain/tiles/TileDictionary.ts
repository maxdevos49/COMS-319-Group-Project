import { ITile } from "./ITile";

export class TileDictionary {
    public tiles_name: Map<string, ITile>;
    public tiles_index: Map<number, ITile>;

    constructor(tiles: ITile[]) {
        this.tiles_name = new Map<string, ITile>();
        this.tiles_index = new Map<number, ITile>();

        tiles.forEach((tile) => {
           this.tiles_name.set(tile.name, tile);
           this.tiles_index.set(tile.index, tile);
        });
    }

    /**
     * Checks if the tile which has the given name is in the given "@<group_name>" group
     * @param tileName The name of the tile to check
     * @param group The group name which is prefixed by an '@' sign
     */
    public isTileInGroup(tileName: string, group: string) {
        let tile: ITile = this.tiles_name.get(tileName);
        if (tile.groups) {
            return tile.groups.includes(group);
        }
        return false;
    }

    /**
     * Checks if the tile which has the given index is in the given "@<group_name>" group
     * @param tileIndex The index of the tile to check
     * @param group The group name which is prefixed by an '@' sign
     */
    public isTileIndexInGroup(tileIndex: number, group: string) {
        let tile: ITile = this.tiles_index.get(tileIndex);
        if (tile.groups) {
            return tile.groups.includes(group);
        }
        return false;
    }

    /**
     * Checks if the tile with the given name identifies with the given name (which can be it's name or the name
     * of a group it belongs to)
     * @param tileName The name of the tile to check
     * @param nameOrGroup The name or group name (prefixed by the '@' sign) to check if the tile identifies as
     */
    public checkTileIdentifiesAs(tileName: string, nameOrGroup: string) {
        if (nameOrGroup.length > 0 && nameOrGroup.charAt(0) == '@') {
            return this.isTileInGroup(tileName, nameOrGroup);
        } else {
            return name == nameOrGroup;
        }
    }
    /**
     * Checks if the tile with the given index identifies with the given name (which can be it's name or the name
     * of a group it belongs to)
     * @param tileIndex The index of the tile to check
     * @param nameOrGroup The name or group name (prefixed by the '@' sign) to check if the tile identifies as
     */
    public checkTileIndexIdentifiesAs(tileIndex: number, nameOrGroup: string) {
        if (nameOrGroup.length > 0 && nameOrGroup.charAt(0) == '@') {
            return this.isTileIndexInGroup(tileIndex, nameOrGroup);
        } else {
            return this.tiles_index.get(tileIndex).name == nameOrGroup;
        }
    }
}