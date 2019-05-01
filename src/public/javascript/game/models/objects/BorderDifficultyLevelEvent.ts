import { EventType, IEvent } from "./IEvent";

export class BorderDifficultyLevelEvent implements IEvent {

    /**
     * The player who is being informed of their new border difficulty
     */
    forPlayerId: string;

    /**
     * The type of this event (should be border difficulty for this class)
     */
    type: EventType;

    /**
     * The new difficulty for this player
     */
    newDifficulty: number;

    constructor(id: string, newDifficulty: number) {
        this.forPlayerId = id;
        this.type = EventType.BorderDifficulty;
        this.newDifficulty = newDifficulty;
    }
}