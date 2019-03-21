import {v1} from "uuid/interfaces";

export class PlayerUpdate {
    /**
     * The id of this player
     */
    public id: v1;
    /**
     * The name of this player
     */
    public name: string;

    /**
     * Constructs a new PlayerUpdate
     * @param id The id of this player
     * @param name THe name of this player
     */
    constructor(id: v1, name: string) {
        this.id = id;
        this.name = name;
    }
}