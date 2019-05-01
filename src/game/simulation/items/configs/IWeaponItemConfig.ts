import { IItemConfig } from "./IItemConfig";

export interface IWeaponItemConfig extends IItemConfig {
    /**
     * The amount of ammo this weapon has
     */
    ammoSize: number;
    /**
     * The clip size of this weapon
     */
    clipSize: number;
    /**
     * The speed at which this weapon can fire in rounds per second
     */
    fireRate: number;
    /**
     * The speed of the bullet fired by this weapon in 100 pixels per size
     */
    bulletSpeed: number;
    /**
     * The speed at which a bullet from this weapon will die in 100 pixels per second
     */
    bulletKillSpeed: number
}