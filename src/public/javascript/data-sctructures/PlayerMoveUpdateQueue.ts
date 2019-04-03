import {PlayerMoveUpdate} from "../models/game/PlayerMoveUpdate";

export class PlayerMoveUpdateQueue {
    /**
     * The current frame that this queue is looking for
     */
    currentFrame: number;
    /**
     * The maximum number of frames that a player can be behind the server and still have their updates count
     */
    maxFrameLag: number;
    /**
     * The maximum number of frames an update can be in the future and still have their update counted (Would normally
     * only be triggered by the client and the servers clocks be extremely out of sync or the server is lagging)
     */
    maxFramePrediction: number;
    /**
     * The map from player to move update for this queue
     */
    playerUpdateMap: Map<string, PlayerMoveUpdate>;

    /**
     * Constructs a new queue like data structure for holding move updates in the interim period between physics frames
     * @param maxFrameLag The maximum number of frames that a player can be behind the server and still have their updates counts
     * @param maxFramePrediction An optional parameter that is set to equal maxFrameLag by default  which
     *          specifies how many frames in the future an update can be and still be accepted
     */
    constructor(maxFrameLag: number, maxFramePrediction: number = maxFrameLag) {
        this.maxFrameLag = maxFrameLag;
        this.maxFramePrediction = maxFramePrediction;

        this.currentFrame = 0;
        this.playerUpdateMap = new Map<string, PlayerMoveUpdate>();
    }

    /**
     * Adds a move update to this queue. If frame this move update is for has already occurred (network latency) then
     * the structure will alias it (pretend that it is for a future update so that it doesn't get ignored). The frame
     * within the PlayerMoveUpdate will not change
     *
     * Only the most recent update will be kept. If the data structure receives an update for frame 1, 5, 10 only the
     * one for frame 10 will be saved.
     *
     * In the above example if the queue has maxFramePrediction set to 4, and the queue's current frame is 4 then
     * frame 5 will be saved.
     *
     * If the frame is further behind than the maximum allowed lag then it will be not be saved
     * @param newUpdate The move update to add to this queue
     */
    public addPlayerMoveUpdate(newUpdate: PlayerMoveUpdate): void {
        // Check that the frame of the new update isn't to far in the past or future
        // TODO: Inform client when this happens so they can compensate
        if ((this.currentFrame - this.maxFrameLag) <= newUpdate.frame &&
            newUpdate.frame <= (this.currentFrame + this.maxFramePrediction)) {
            // Check if an update already exists
            if (this.playerUpdateMap.has(newUpdate.id)) {
                // Check if the new update is more recent and overwrite the old one if it is
                if (this.playerUpdateMap.get(newUpdate.id).frame <= newUpdate.frame) {
                    this.playerUpdateMap.set(newUpdate.id, newUpdate);
                }
            } else {
                this.playerUpdateMap.set(newUpdate.id, newUpdate);
            }
        }
    }

    /**
     * Pops the update that should be performed next off of the queue. This will be the oldest update on the queue. If
     * no move update is found then returns null.
     */
    public popPlayerMoveUpdate(id: string): PlayerMoveUpdate | null {
        if (this.playerUpdateMap.has(id)) {
            let temp: PlayerMoveUpdate = this.playerUpdateMap.get(id);
            this.playerUpdateMap.delete(id);
            return temp;
        } else {
            return null;
        }
    }

    /**
     * Increments the current physics frame stored internally by this data structure by one. This should be performed
     * once the final pop has been performed on this object for the current physics frame.
     */
    public incrementFrame(): void {
        this.currentFrame++;
        // Check if any updates are now retroactively to far in the past. This shouldn't happen often but it would be
        // odd if this check didn't exist
        let toDeleteIds: string[] = [];
        this.playerUpdateMap.forEach((update: PlayerMoveUpdate, id: string) => {
            if ((this.currentFrame - this.maxFrameLag) > update.frame) {
                toDeleteIds.push(id);
            }
        });
        toDeleteIds.forEach((id: string) => {
           this.playerUpdateMap.delete(id);
        });
    };

    /**
     * Returns the size of the update queue.
     *
     * @return {number} The number of updates in the queue.
     */
    public size(): number {
        return this.playerUpdateMap.size;
    }
}