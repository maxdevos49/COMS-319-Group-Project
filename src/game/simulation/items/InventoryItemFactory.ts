import { IItemConfig } from "./configs/IItemConfig";
import { ItemType } from "../../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";
import { WeaponInventoryItem } from "./WeaponInventoryItem";
import { IWeaponItemConfig } from "./configs/IWeaponItemConfig";
import v1Gen from "uuid/v1";

export namespace InventoryItemFactory {
    /**
     * Creates an item from the given item config or returns null if the config is invalid
     * @param config The config to create the item from
     */
    export function createInventoryItem(config: IItemConfig): WeaponInventoryItem {
        let id: string = v1Gen();

        let type: ItemType = (<any>ItemType)[config.type];

        if (type == ItemType.Weapon) {
            return new WeaponInventoryItem(id, config as IWeaponItemConfig);
        }

        return null;
    }
}
