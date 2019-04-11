import { v1 } from "uuid/interfaces";

export class GamesList {
    /**
     * The list of ids of every running on the server
     */
    public gameIds: string[];

    constructor() {
        this.gameIds = [];
    }
}