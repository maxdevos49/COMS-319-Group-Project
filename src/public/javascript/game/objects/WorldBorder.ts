import { GameObject } from "./GameObject.js";
import { WorldBorderPositionUpdate } from "../models/objects/WorldBorderPositionUpdate.js";
import { GameScene } from "../scenes/GameScene.js";
import { WorldBorderObjectDescription } from "../models/objects/Descriptions/WorldBorderObjectDescription.js";
import { SCALE_FACTOR } from "../Game.js";
import Arc = Phaser.GameObjects.Arc;

export class WorldBorder extends GameObject {

    borderCircle: Arc;

    constructor(scene: GameScene, description: WorldBorderObjectDescription) {
        super(scene, description.centeredX * SCALE_FACTOR, description.centeredY * SCALE_FACTOR, "sprites", "objects/border/center")
        this.id = description.id;

        this.setScale(3.0, 3.0);

        this.borderCircle = scene.add.arc(description.centeredX * SCALE_FACTOR, description.centeredY * SCALE_FACTOR,  description.curRadius * SCALE_FACTOR, 0, 360);
        this.borderCircle.setStrokeStyle(4, 0xff0000, 0.6);
    }

    applyUpdate(newUpdate: WorldBorderPositionUpdate): void {
        // Offset the center by half the distance has shrunk to keep the circle centered
        this.borderCircle.x += (this.borderCircle.radius - newUpdate.curRadius * SCALE_FACTOR) / 2;
        this.borderCircle.y += (this.borderCircle.radius - newUpdate.curRadius * SCALE_FACTOR) / 2;
        this.borderCircle.setRadius(newUpdate.curRadius * SCALE_FACTOR);
    }
}