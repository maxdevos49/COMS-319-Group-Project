import { gameConfig } from "./GameConfig.js";

export class Game extends Phaser.Game {
    constructor() {
        super(gameConfig);
    }
}

 export const SCALE_FACTOR = 100;