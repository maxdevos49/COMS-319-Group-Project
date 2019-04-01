import {PositionUpdate} from "../models/game/PositionUpdate";

export class PositionUpdateQueue {
    private updates: Map<string, PositionUpdate>;

    constructor() {
        this.updates = new Map<string, PositionUpdate>();
    }

    /**
     * Adds the given update to this queue, if the an update already exists with the given id then the queue will only
     * add it if it is the newest update for it
     * @param newUpdate The update to add to the queue
     */
    public addUpdate(newUpdate: PositionUpdate): void {

    }
    /**
     * Pops the most recent new update for the given id or null if no new update exists for it
     * @param id The id of the thing to get the update for
     */
    public popUpdate(id: string): PositionUpdate {
        return null;
    }

}