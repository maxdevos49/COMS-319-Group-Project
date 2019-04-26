import { InventoryItem } from "./InventoryItem";
import { ItemType } from "../../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";

export class DefaultInventoryItem extends InventoryItem {

    //Probably should include the simulation here but maybe that will be on the player in the inventory
    constructor(givenName: string, givenTip?: string) {
        super(ItemType.Default, "Default", givenName, givenTip);
    }

    /**
     * down here goes the actual implementation of the item and what it will do
     * probably should have a weapon, health, armor interfaces that this item can implement for its
     * corresponding effects
     */

}