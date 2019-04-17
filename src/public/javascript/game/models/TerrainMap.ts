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
	 * The 2d array containing the tile map indices for the top layer
	 */
    public top: number[][];
    /**
     * The 2d array containing the tile map indices for the bottom layer
     */
    public bottom: number[][];


	/**
	 * Constructs a new terrain map with the given width and height
	 * @param width The width of the terrain map
	 * @param height The height of the terrain map
	 * @param topDefaultBlock The default block for the top layer of the map
	 * @param bottomDefaultBlock The default block for the bottom layer of the map
	 * @param tileWidth The width of a tile in pixels. Default = 50
	 * @param tileHeight The height of a tile in pixels. Default = 50
	 */
    constructor(width: number, height: number, topDefaultBlock: number, bottomDefaultBlock: number, tileWidth: number = 50, tileHeight: number = 50) {
        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        // Initialize a data with the given default blocks
        this.top = new Array(height);
        this.bottom = new Array(height);
        for (let y = 0; y < height; y++) {
            this.top[y] = new Array(this.width).fill(topDefaultBlock);
            this.bottom[y] = new Array(this.height).fill(bottomDefaultBlock);
        }
    }
}