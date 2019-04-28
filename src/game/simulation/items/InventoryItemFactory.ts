import { IItemConfig } from "./configs/IItemConfig";
import { ItemType } from "../../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";
import { WeaponInventoryItem } from "./WeaponInventoryItem";
import { IWeaponItemConfig } from "./configs/IWeaponItemConfig";

namespace InventoryItemFactory {
    /**
     * Creates an item from the given item config or returns null if the config is invalid
     * @param config The config to create the item from
     */
    export function createInventoryItem(config: IItemConfig): WeaponInventoryItem {
        if (config.type == ItemType.Weapon.toString()) {
            return new WeaponInventoryItem(config as IWeaponItemConfig);
        }

        return null;
    }
}
