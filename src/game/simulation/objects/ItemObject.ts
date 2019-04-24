import { GameObject } from "./GameObject";
import { GameSimulation } from "../GameSimulation";
import { GameObjectType, IObjectDescription } from "../../../public/javascript/game/models/objects/IObjectDescription";
import { IPositionUpdate } from "../../../public/javascript/game/models/objects/IPositionUpdate";

class ItemObject extends GameObject {
    
    constructor(givenSimulation: GameSimulation, config: IITemConfig) {
        super(config.id, config.type, givenSimulation);
    }

    public getAsNewObject(): IObjectDescription {
        return null;
    }

    public getPositionUpdate(frame: number): IPositionUpdate {
        return null;
    }

    collideWith(object: IObjectDescription): void {

    }

    update(): void {

    }
}

export interface IITemConfig {
    id: string;
    type: GameObjectType
}