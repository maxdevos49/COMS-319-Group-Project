import { GameObjectType } from "./IObjectDescription";
import { ItemType, IITemDescription } from "./IItemObjectDescription";

export class ItemObjectDescription implements IITemDescription {

    /**
     * Id of item
     */
    public id: string;

    /**
     * Type of Game Object
     */
    public type: GameObjectType;

    /**
     * Type of item
     */
    public itemType: ItemType;

	/**
	 * The position of the item horizontaly
	 */
    public x: number;

    /**
     * The position of the item vertically
     */
    public y: number;

    /**
     * The angle of the item
     */
    public angle: number;

    /**
     * The sprite for the item
     */
    public sprite: string;

    /**
     * The name of the item
     */
    public name: string;

    /**
     * The tool tip for the item
     */
    public tip: string;


    constructor(givenId: string, givenX: number, givenY: number, angle: number, givenItemType: ItemType, givenSprite: string, givenName: string, givenTip?: string) {
        //properties
        this.id = givenId;
        this.x = givenX;
        this.y = givenY;
        this.angle = angle;
        this.type = GameObjectType.Item;
        this.itemType = givenItemType;
        this.sprite = givenSprite;
        this.name = givenName;
        this.tip = givenTip;
    }

}