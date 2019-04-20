import { gameConfig } from "./GameConfig.js";

export class Game extends Phaser.Game {
    constructor() {
        super(gameConfig);
    }
}

export const SCALE_FACTOR = 100;

console.log("Starting phaser game");
let game: Game = new Game();