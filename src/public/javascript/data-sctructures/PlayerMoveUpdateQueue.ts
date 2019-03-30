import {PlayerMoveUpdate} from "../models/game/PlayerMoveUpdate";

export class PlayerMoveUpdateQueue {
    constructor(maxFrameLag: number) {

    }

    /**
     * Adds a move update to this queue. If frame this move update is for has already occurred (network latency) then
     * the structure will alias it (pretend that it is for a future update so that it doesn't get ignored). The frame
     * within the PlayerMoveUpdate will not change
     *
     * An update that actually is intended for a frame that is aliased by another one will overwrite the one that is
     * only aliased to be for that frame (To prevent lag from stacking onto itself).
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