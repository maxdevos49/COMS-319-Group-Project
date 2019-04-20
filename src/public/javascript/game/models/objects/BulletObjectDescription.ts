import { IObjectDescription, GameObjectType } from "./IObjectDescription";

/**
 * Describes the initial state of a bullet object in the game
 */
export class BulletObjectDescription implements IObjectDescription {
	id: string;
	type: GameObjectType;

	/**
	 * The id of the object that owns this bullet (usually the object that shot it)
	 */
	ownerId: string;
	/**
	 * The x coordinate of the bullet
	 */
	x: number;
	/**
	 * The y coordinate of the bullet
	 */
	y: number;
	/**
	 * The angle the bullet is facing in radians
	 */
	angle: number;

	constructor(id: string, ownerId: string, x: number, y: number, angle: number) {
		this.id = id;
		this.ownerId = ownerId;
		this.type = GameObjectType.Bullet;
		this.x = x;
		this.y = y;
		this.angle = angle;
	}
}