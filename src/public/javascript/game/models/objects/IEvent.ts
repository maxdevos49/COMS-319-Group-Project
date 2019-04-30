export interface IEvent {
    forPlayerId: string;
    type: EventType;
}

export enum EventType {
    Health,
    BorderDifficulty,
    Stats
}
