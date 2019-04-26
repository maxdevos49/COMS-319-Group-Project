import { InventoryItem } from "./InventoryItem";
import { ItemType } from "../../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";

export class DefaultInventoryItem extends InventoryItem {
    constructor(givenName: string, givenTip?: string) {
        super(ItemType.Default, "Default", givenName, givenTip);
    }
}