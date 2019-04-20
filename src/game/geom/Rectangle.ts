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

    /**
     * Checks if a rectangle intersects this one
     * @param other The other rectangle to check if it intersects this one
     */
    public intersects(other: Rectangle): boolean {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;

        /*return !(this.x + this.width <= other.x
            || other.x + other.width <= this.x
            || this.y + this.height <= other.y
            || other.y + other.height <= this.y);*/
    }

    public toString(): string {
        return "[x: " + this.x + " y: " + this.y + " width: " + this.width + " height: " + this.height + "]";
    }
}