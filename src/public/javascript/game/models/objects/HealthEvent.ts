import { IEvent, EventType } from "./IEvent";

export class HealthEvent implements IEvent {
    public forPlayerId: string;
    public type: EventType;
    public setHealthTo: number;

    constructor(forPlayerId: string, setHealthTo: number) {
        this.forPlayerId = forPlayerId;
        this.type = EventType.Health;
        this.setHealthTo = setHealthTo;
    }
}
