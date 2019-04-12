import { IObjectDescription, NewObjectType } from "./IObjectDescription";

/**
 * Describes the initial state of a game player. This is used to inform clients of new players that they don't
 * know about
 */
export class PlayerObjectDescription implements IObjectDescription {
	id: string;
	type: NewObjectType;

	/**
	 * The position of the player
	 */
	x: number;
	y: number;
	/**
	 * The direction the player is facing in radians
	 */
	facing: number;

	/**
	 * Constructs a new NewPlayerObject
	 * @param id The id of the player this update represents
	 * @param x The x coordinate of this player
	 * @param y The y coordinate of this player
	 * @param facing The direction the player is facing in radians
	 */
	constructor(id: string, x: number, y: number, facing: number){
		this.id = id;
		this.type = NewObjectType.Player;
		this.x = x;
		this.y = y;
		this.facing = facing;
	}
}