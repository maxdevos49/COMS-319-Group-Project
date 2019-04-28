import { InventoryItem } from "./InventoryItem";
import { IWeaponItemConfig } from "./configs/IWeaponItemConfig";

export class WeaponInventoryItem extends InventoryItem {
    /**
     * The amount of ammo this weapon has (not including the ammo in the clip
     */
    ammo: number;
    /**
     * The number of rounds the clip contains
     */
    readonly clipSize: number;
    /**
     * The amount of ammo that is in the clip right now
     */
    clipAmmo: number;
    /**
     * The rate at which this gun can fire in rounds per second
     */
    readonly fireRate: number;
    /**
     * The speed (in 100 pixels per second) that the bullets from this gun are fired
     */
    readonly bulletSpeed: number;
    /**
     * The speed (in 100 pixels per second) that the bullet will be removed from the game when it dips below
     */
    readonly bulletKillSpeed: number;

    constructor(config: IWeaponItemConfig) {
        super(config);

        this.ammo = config.ammoSize;
        this.clipSize = config.clipSize;
        this.clipAmmo = 0;
        this.fireRate = config.fireRate;
        this.bulletSpeed = config.bulletSpeed;
        this.bulletKillSpeed = config.bulletKillSpeed;
    }
}