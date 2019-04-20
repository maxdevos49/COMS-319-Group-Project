import { IPositionUpdate } from "./IPositionUpdate";

export class BulletPositionUpdate implements IPositionUpdate {
	frame: number;
	id: string;

	/**
	 * The x coordinate of the bullet
	 */
	x: number;
	/**
	 * The y coordinate of the bullet
	 */
	y: number;

	/**
	 * Constructs a new bullet position update
	 * @param id The id of the bullet this update is for
	 * @param frame The frame number this update is for
	 * @param x The x coordinate of the bullet at the given frame
	 * @param y The y coordinate of the bullet at the given frame
	 */
	constructor(id: string, frame: number, x: number, y: number) {
		this.id = id;
		this.frame = frame;
		this.x = x;
		this.y = y;
	}

}