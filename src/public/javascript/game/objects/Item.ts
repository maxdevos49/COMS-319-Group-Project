import { GameObject } from "./GameObject.js";
import { SCALE_FACTOR } from "../Game.js";
import { ItemObjectDescription } from "../models/objects/Descriptions/ItemObjectDescription.js";
import { ItemPositionUpdate } from "../models/objects/ItemPositionUpdate.js";
import { ToolTip } from "./Tooltip.js";

export class Item extends GameObject {

    /**
     * The tooltip to show for the item
     */
    private toolTip: ToolTip;

	/**
	 * Constructs a new bullet object
	 * @param givenScene The scene this bullet is to belong to
	 * @param givenDescription The description to create the bullet from
	 */
    constructor(givenScene: Phaser.Scene, givenDescription: ItemObjectDescription) {
        super(givenScene, givenDescription.x * SCALE_FACTOR, givenDescription.y * SCALE_FACTOR, givenDescription.sprite);

        //properties
        this.id = givenDescription.id;

        //Text
        this.toolTip = new ToolTip(this.scene, {
            x: givenDescription.x * SCALE_FACTOR,
            y: givenDescription.y * SCALE_FACTOR,
            name: "Default",//Add to itemobject description
            tip: "Pickup press p",
            font: "november",
            fontSize: 15
        });

        this.setScale(0.3, 0.3);//temp

        this.setInteractive();

        this.on("pointerover", () => {
            this.showTooltip();
        })

        this.on("pointerout", () => {
            this.hideTooltip();
        })

        this.hideTooltip();
    }

    public showTooltip(): void {
        this.toolTip.fadeIn();
    }

    public hideTooltip(): void {
        this.toolTip.fadeOut();
    }

    public destroy(): void {
        this.toolTip.destroy();
        super.destroy();
    }

    /**
     * Applies a ItemPositionUpdate
     * @param givenUpdate
     */
    public applyUpdate(givenUpdate: ItemPositionUpdate): void {
        this.setPosition(givenUpdate.x * SCALE_FACTOR, givenUpdate.y * SCALE_FACTOR);
    }
}