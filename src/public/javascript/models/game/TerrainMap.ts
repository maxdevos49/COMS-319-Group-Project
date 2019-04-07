export class TerrainMap {
    /**
     * The width of the terrain map
     */
    public width: number;
    /**
     * The height of the terrain map
     */
    public height: number;
    /**
     * The 2d array containing the tile map indices
     */
    public map: number[][];

    /**
     * Constructs a new terrain map with the given width and height
     * @param width The width of the terrain map
     * @param height The height of the terrain map
     * @param defaultBlock The default index the terrain map will be initialized with
     */
    constructor(width: number, height: number, defaultBlock: number) {
        this.width = width;
        this.height = height;
        // Initialize a map with the given default block
        this.map = [];
        for (let y = 0; y < height; y++) {
            this.map[y] = new Array(this.width).fill(defaultBlock);
        }
    }
}