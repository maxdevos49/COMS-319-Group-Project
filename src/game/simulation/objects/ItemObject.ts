import { GameObject } from "./GameObject";
import { GameSimulation } from "../GameSimulation";
import { GameObjectType, IObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { IPositionUpdate } from "../../../public/javascript/game/models/objects/IPositionUpdate";
import { ItemPositionUpdate } from "../../../public/javascript/game/models/objects/ItemPositionUpdate";
import { b2Body, b2BodyDef, b2BodyType } from "../../../../lib/box2d-physics-engine/Box2D";
import { ItemObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/ItemObjectDescription";
import { ItemType } from "../../../public/javascript/game/models/objects/Descriptions/IItemObjectDescription";

class ItemObject extends GameObject {

    private body: b2Body;

    private itemType: ItemType;

    constructor(givenSimulation: GameSimulation, config: IITemConfig) {
        super(config.id, config.type, givenSimulation);

        this.itemType = config.itemType;

        //Body
        const bodyDef: b2BodyDef = new b2BodyDef();
        bodyDef.type = b2BodyType.b2_dynamicBody;
        bodyDef.position.Set(0, 0);
        this.body = this.simulation.world.CreateBody(bodyDef);
    }

    public destroy(): void {
        this.simulation.world.DestroyBody(this.body);
    }

    public getAsNewObject(): IObjectDescription {
        return new ItemObjectDescription(this.id, this.body.GetPosition().x, this.body.GetPosition().y, this.itemType);
    }

    public getPositionUpdate(frame: number): IPositionUpdate {
        return new ItemPositionUpdate(
            this.id,
            frame,
            this.body.GetPosition().x,
            this.body.GetPosition().y
        );
    }

    collideWith(object: IObjectDescription): void {
        this.simulation.destroyGameObject(this.id);
    }

    update(): void {
        //do stuff here over time if needed(animated, rotates, or something of the sort)
    }
}

export interface IITemConfig {
    id: string;
    type: GameObjectType;

    itemType: ItemType;
}