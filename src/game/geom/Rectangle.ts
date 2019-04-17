/**
 * A lightweight representation of a 2d rectangle
 */
export class Rectangle {
    /**
     * The x coordinate of the top-left corner of the rectangle
     */
    public x: number;
    /**
     * The y coordinate of the top-left corner of the rectangle
     */
    public y: number;
    /**
     * How far the rectangle extends to the right
     */
    public width: number;
    /**
     * How far the rectangle extends down
     */
    public height: number;

    /**
     * Constructs a new rectangle
     * @param x The x coordinate of the top-left corner of the rectangle
     * @param y The y coordinate of the top-left corner of the rectangle
     * @param width The distance the rectangle extends to the right
     * @param height The distance the rectangle extends dwon
     */
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Checks if this rectangle contains the given point
     * @param x The x coordinate of the point to check
     * @param y The y coordinate of the point to check
     */
    public contains(x: number, y: number) {
        return (this.x > x && x < (this.x + this.width)) &&
            (this.y > y && y < (this.y + this.height))
    }
}