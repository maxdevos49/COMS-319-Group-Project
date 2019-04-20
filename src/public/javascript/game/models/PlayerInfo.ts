import { v1 } from "uuid/interfaces";

export class PlayerInfo {
    /**
     * The id of this player
     */
    public id: string;
    /**
     * The name of this player
     */
    public name: string;

    /**
     * Constructs a new PlayerUpdate
     * @param id The id of this player
     * @param name THe name of this player
     */
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}