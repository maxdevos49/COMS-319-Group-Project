import { IEvent, EventType } from "./IEvent";
import { PlayerStats } from "../../../../../../src/game/simulation/objects/PlayerStats";

export class StatsEvent implements IEvent {
    public forPlayerId: string;
    public type: EventType;
    public stats: PlayerStats;

    constructor(forPlayerId: string, stats: PlayerStats) {
        this.forPlayerId = forPlayerId;
        this.type = EventType.Stats;
        this.stats = stats;
    }
}
