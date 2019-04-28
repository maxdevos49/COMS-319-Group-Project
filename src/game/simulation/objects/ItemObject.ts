import { GameObject } from "./GameObject";
import { GameSimulation } from "../GameSimulation";
import { GameObjectType, IObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { IPositionUpdate } from "../../../public/javascript/game/models/objects/IPositionUpdate";
import { ItemPositionUpdate } from "../../../public/javascript/game/models/objects/ItemPositionUpdate";
import { b2Body, b2BodyDef, b2BodyType, b2FixtureDef, b2CircleShape, b2Fixture } from "../../../../lib/box2d-physics-engine/Box2D";
import { ItemObjectDescription } from "../../../public/javascript/game/models/objects/Descriptions/ItemObjectDescription";
import { worldCollisionFilter } from "../CollisionFilters";
import { InventoryItem } from "./InventoryItem";
export class ItemObject extends GameObject {

    /**
     * The physics body
     */
    private body: b2Body;

    /**
     * The hit area of the item
     */
    public fixture: b2Fixture;

    /**
     * The unique Item reference for the item type.
     */
    public item: InventoryItem;

    constructor(givenSimulation: GameSimulation, config: IITemObjectConfig) {
        super(config.id, GameObjectType.Item, givenSimulation);

        this.item = config.item;

        //Body
        const bodyDef: b2BodyDef = new b2BodyDef();
        bodyDef.type = b2BodyType.b2_staticBody;
        bodyDef.position.Set(config.x, config.y);
        this.body = this.simulation.world.CreateBody(bodyDef);

        //Create the collision fixture for the bullet
        const fixtureDef: b2FixtureDef = new b2FixtureDef();
        fixtureDef.userData = config.id;
        fixtureDef.shape = new b2CircleShape(.05);
        fixtureDef.filter.Copy(worldCollisionFilter);
        fixtureDef.density = 0;
        this.fixture = this.body.CreateFixture(fixtureDef);

        this.simulation.addGameObject(this);
    }

    /**
     * Destoys an item
     */
    public destroy(): void {
        this.simulation.world.DestroyBody(this.body);
    }

    /**
     *Gets a new GameObject Description for adding to clients
     */
    public getAsNewObject(): IObjectDescription {
        return new ItemObjectDescription(this.id, this.body.GetPosition().x, this.body.GetPosition().y, this.item.itemType, this.item.sprite, this.item.name, this.item.tip);
    }

    /**
     * Probably will not be used but does give the ability to
     * move items if necessary
     * @param frame
     */
    public getPositionUpdate(frame: number): IPositionUpdate {
        return new ItemPositionUpdate(
            this.id,
            frame,
            this.body.GetPosition().x,
            this.body.GetPosition().y
        );
    }

    /**
     * If the item is collided with a player then the player is able
     *  to pick it up. The player does not auto pick up items but only
     * if they press a specific key within a range. If players are within
     * the bounds of the item then they should be able to pick it up
     *
     * @param object
     */
    collideWith(object: IObjectDescription): void {
        //add into inventory eventually of colliding player

        //do this after adding to inventory
        this.simulation.destroyGameObject(this.id);
    }


}

/**
 * Configuration interface for constructing ItemObject's
 */
export interface IITemObjectConfig {
    id: string;

    /**
     * The horizonal location
     */
    x: number;

    /**
     * The vertical location
     */
    y: number;

    /**
     * The type of item
     */
    item: InventoryItem;
}