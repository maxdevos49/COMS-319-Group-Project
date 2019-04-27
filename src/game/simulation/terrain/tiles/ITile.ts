export interface ITile {
    name: string;
    id: number;
    groups?: string[];
    layer: string;
}

export interface ITileOption {
    name: string,
    rarity: number
}

export interface ITileLayer {
    name: string;
    level: number;
    collides: boolean;
    removeAbove?: boolean;
}

export class TileSet {
    name: string;
    image: string;
    imagewidth: number;
    imageheight: number;
    tileheight: number;
    tilewidth: number;
    tilecount: number;
    columns: number;
    rows: number;
    readonly margin: number = 0;
    readonly spacing: number = 0;
    readonly firstgid: number = 0;
    tiles: any;

    constructor(name: string, image: string, rows: number, columns: number, tileWidth: number, tileHeight: number, tiles: ITile[]) {
        this.name = name;
        this.image = image;
        this.imagewidth = columns * tileWidth;
        this.imageheight = rows * tileHeight;
        this.tileheight = tileHeight;
        this.tilewidth = tileWidth;
        this.tilecount = (rows * columns);
        this.columns = columns;
        this.rows = rows;
        // Would be better as a map, HOWEVER a map cannot be JSON stringified which is a requirement
        this.tiles = {};
        tiles.forEach((tile) => this.tiles[tile.id] = tile);
        // Fill in the holes
        for (let i = 0; i < this.tilecount; i++) {
            let matchingTile: ITile = tiles.find((tile: ITile) => tile.id == i);
            if (matchingTile) {
                this.tiles[i] = matchingTile;
            } else {
                // Fill the hole
                this.tiles[i] = {id: i};
            }
        }
    }
}