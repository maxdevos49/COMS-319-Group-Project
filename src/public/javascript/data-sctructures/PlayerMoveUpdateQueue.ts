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

    }

    /**
     * Adds a move update to this queue. If frame this move update is for has already occurred (network latency) then
     * the structure will alias it (pretend that it is for a future update so that it doesn't get ignored). The frame
     * within the PlayerMoveUpdate will not change
     *
     * Only the most recent update will be kept. If the data structure receives an update for frame 1, 5, 10 only the
     * one for frame 10 will be saved. Even if internally the simulation
     *
     * If the frame is further behind than the maximum allowed lag then it will be not be saved
     * @param newUpdate The move update to add to this queue
     */
    public addPlayerMoveUpdate(newUpdate: PlayerMoveUpdate): void {

    }

    /**
     * Pops the update that should be performed next off of the queue. This will be the oldest update on the queue. If
     * no move update is found then returns null.
     */
    public popPlayerMoveUpdate(id: string): PlayerMoveUpdate | null {
        return null;
    }

    /**
     * Increments the current physics frame stored internally by this data structure by one. This should be performed
     * once the final pop has been performed on this object for the current physics frame.
     */
    public incrementFrame(): void {

    };

}