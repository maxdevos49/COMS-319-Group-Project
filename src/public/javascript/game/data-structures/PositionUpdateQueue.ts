import {IPositionUpdate} from "../models/objects/IPositionUpdate";

export class PositionUpdateQueue {
    /**
     * The map from id to update
     */
    private updates: Map<string, IPositionUpdate>;

    constructor() {
        this.updates = new Map<string, IPositionUpdate>();
    }

    /**
     * Adds the given update to this queue, if the an update already exists with the given id then the queue will only
     * add it if it is the newest update for it
     * @param newUpdate The update to add to the queue
     */
    public addUpdate(newUpdate: IPositionUpdate): void {
        if (this.updates.has(newUpdate.id)) {
            // Check if the new update is newer than the old one
            if (this.updates.get(newUpdate.id).frame < newUpdate.frame) {
                this.updates.set(newUpdate.id, newUpdate);
            }
        } else {
            this.updates.set(newUpdate.id, newUpdate);
        }
    }
    /**
     * Pops the most recent new update for the given id or null if no new update exists for it
     * @param id The id of the thing to get the update for
     */
    public popUpdate(id: string): IPositionUpdate | null {
        if (this.updates.has(id)) {
            let tempUpdate: IPositionUpdate = this.updates.get(id);
            this.updates.delete(id);
            return tempUpdate;
        } else {
            return null;
        }
    }

}