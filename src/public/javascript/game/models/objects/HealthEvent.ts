import { IEvent, EventType } from "./IEvent";

export class HealthEvent implements IEvent {
    public forPlayerId: string;
    public type: EventType;
    public setHealthTo: number;

    constructor(id: string, health: number) {
        this.forPlayerId = id;
        this.type = EventType.Health;
        this.setHealthTo = health;
    }
}
