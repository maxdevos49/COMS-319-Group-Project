/**
 * A lightweight representation of a 2d point
 */
export class Point {
    /**
     * The x coordinate of the point
     */
    public x: number;
    /**
     * The y coordinate of the point
     */
    public y: number;

    /**
     * Constructs a new rectangle
     * @param x The x coordinate of the point
     * @param y The y coordinate of the point
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}