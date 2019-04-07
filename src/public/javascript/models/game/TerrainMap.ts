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
	public map: number[][];

	/**
	 * Constructs a new terrain map with the given width and height
	 * @param width The width of the terrain map
	 * @param height The height of the terrain map
	 * @param defaultBlock The default index the terrain map will be initialized with
	 * @param tileWidth The width of a tile in pixels. Default = 50
	 * @param tileHeight The height of a tile in pixels. Default = 50
	 */
	constructor(width: number, height: number, defaultBlock: number, tileWidth: number = 50, tileHeight: number = 50) {
		this.width = width;
		this.height = height;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		// Initialize a map with the given default block
		this.map = [];
		for (let y = 0; y < height; y++) {
			this.map[y] = new Array(this.width).fill(defaultBlock);
		}
	}
}