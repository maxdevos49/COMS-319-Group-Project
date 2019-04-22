import { ITile, ITileLayer, TileSet } from "../../../../game/simulation/terrain/tiles/ITile";

/**
 * Describes a tile map layer. This class has properties as phaser 3 expects them when loading from tile map JSON
 */
export class PhaserTileMapLayer {
    /**
     * The name of this layer
     */
    name: string;
    /**
     * The x offset of this layer, usually 0
     */
    x: number;
    /**
     * The y offset of this layer, usually 0
     */
    y: number;
    /**
     * The width of this layer
     */
    width: number;
    /**
     * The height of this layer
     */
    height: number;
    /**
     * The indices of each tile in this map. Organized row-by-row from left-to-right and top-to-bottom
     */
    data: number[];
    /**
     * The opacity of this number, usually just 1
     */
    opacity: number;
    /**
     * Whether this layer is visible, usually true
     */
    visible: boolean;
    /**
     * The identifies for when this object is converted to JSON
     */
    readonly type: string = "tilelayer";

    /**
     * Constructs a new tile map layer with the given name and dimensions
     * @param name The name of the layer
     * @param width The width of this layer
     * @param height The height of this layer
     * @param defaultTile The tile index the layer should be filled with
     */
    constructor(name: string, width: number, height: number, defaultTile: number = 0) {
        this.name = name;
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.data = new Array(width * height);
        for (let i = 0; i < this.data.length; i++) this.data[i] = defaultTile;
        this.opacity = 1;
        this.visible = true;
    }
}

export class TerrainMap {
    /**
     * The width of this tile map
     */
    public width: number;
    /**
     * The height of this tile map
     */
    public height: number;
    /**
     * The array of tile map layers sorted by lowest level to the highest level
     */
    public layers: PhaserTileMapLayer[];
    /**
     * A map from layer name to the index in the layers array
     */
    public  layerNameToIndex: Map<string, number>;
    /**
     * The width of each tile
     */
    public tilewidth: number;
    /**
     * The height of each tile
     */
    public tileheight: number;
    /**
     * Internal value for phaser
     */
    public readonly nextobjectid: number = 1;
    /**
     * Needed by phaser
     */
    public readonly orientation: string = "orthogonal";
    /**
     * Needed by phaser
     */
    public  readonly renderorder: string = "right-down";
    /**
     * Needed by phaser
     */
    public readonly tiledversion: string = "1.0";
    /**
     * Needed by phaser
     */
    public readonly version: string = "1.0";
    /**
     * Needed by phaser
     */
    public readonly type: string = "map";
    /**
     * The tileset used by this terrain map
     */
    tilesets: TileSet[];

    constructor(width: number, height: number, tileWidth: number, tileHeight: number, layers: ITileLayer[], tiles: ITile[], defaultTile: number = 0) {
        this.width = width;
        this.height = height;
        this.layers = [];
        this.layerNameToIndex = new Map<string, number>();
        // Sort the layers by their level
        layers.sort((layer1, layer2) => layer2.level - layer1.level);
        for (let i = 0; i < layers.length; i++) {
            this.layers.push(new PhaserTileMapLayer(layers[i].name, width, height, defaultTile));
            this.layerNameToIndex.set(layers[i].name, i);
        }
        this.tilewidth = tileWidth;
        this.tileheight = tileHeight;
        this.tilesets = [];
        this.tilesets.push(new TileSet("tiles", "tiles", 20, 20, 32, 32, tiles));
    }

    /**
     * The the highest tile at the given location. If a tile layer has 0 at the given index it will try the next lower. If
     * no tile is found on any layer this will return 0
     * @param x The x coordinate of the tile to check
     * @param y The y coordinate of the tile to check
     * @param ignore Optional array of strings with the names of layers to ignore when performing this search
     */
    public getHighestTile(x: number, y: number, ignore?: string[]): number {
        for (let i = this.layers.length - 1; i >= 0; i--) {
            let curLayer = this.layers[i];
            // Check if this layer should be ignored
            if (ignore) {
                if (ignore.includes(curLayer.name)) continue;
            }
            // Check if the block at this layer is occupied and return it if it is
            if (curLayer.data[(y * curLayer.width) + x] != 0) {
                return curLayer.data[(y * curLayer.width) + x];
            }
        }
        // All layers have been check and no solid block has been found
        return 0;
    }

    /**
     * Sets the tile index at the given layer and coordinate
     * @param layerName The name of the layer to set the tile of allowing a '&' delimited list of layers
     * @param x The x coordinate of the tile to set in the given layer
     * @param y The y coordinate of the tile to set in the given layer
     * @param index The index to set the tile to
     */
    public setBlock(layerName: string, x: number, y: number, index: number): void {
        let layerNames: string[] = layerName.split("&");
        layerNames.forEach((name => {
            let layer = this.layers[this.layerNameToIndex.get(name)];
            layer.data[(y * layer.width) + x] = index;
        }));
    }
}