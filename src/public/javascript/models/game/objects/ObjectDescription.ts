/**
 * Describes the initial state of a game object. This is used to inform clients of new game objects that they don't
 * know about. It's expected that sub-classes of this object will be made for each game object type
 */
export interface ObjectDescription {
	/**
	 * The id of the new object
	 */
	id: string;
	/**
	 * The type of the new object
	 */
	type: NewObjectType;
}
export enum NewObjectType {
	Player
}