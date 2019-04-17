export class TerrainMap {
	/**
	 * The width of the terrain map in tiles
	 */
    public width: number;
	/**
	 * The height of the terrain map in tiles
	 */
    public height: number;
	/**
	 * The width of a tile in pixels
	 */
    public tileWidth: number;
	/**
	 * The height of a tile in pixels
	 */
    public tileHeight: number;
	/**
	 * The 2d array containing the tile map indices
	 */
    public data: number[][];


	/**
	 * Constructs a new terrain map with the given width and height
	 * @param width The width of the terrain map
	 * @param height The height of the terrain map
	 * @param defaultBlock The default block to fill the map with
	 * @param tileWidth The width of a tile in pixels. Default = 50
	 * @param tileHeight The height of a tile in pixels. Default = 50
	 */
    constructor(width: number, height: number, defaultBlock: number, tileWidth: number = 50, tileHeight: number = 50) {
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        // Initialize a data with the given default blocks
        this.data = new Array(height);
        for (let y = 0; y < height; y++) {
            this.data[y] = new Array(this.width).fill(defaultBlock);
        }
    }
}