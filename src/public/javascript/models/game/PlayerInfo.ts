import {v1} from "uuid/interfaces";

export class PlayerUpdate {
    /**
     * The id of this player
     */
    public id: string;
    /**
     * The name of this player
     */
    public name: string | undefined;

    /**
     * Constructs a new PlayerUpdate
     * @param id The id of this player
     * @param name THe name of this player
     */
    constructor(id: string, name: string | undefined) {
        this.id = id;
        this.name = name;
    }
}