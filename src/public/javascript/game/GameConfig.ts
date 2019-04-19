import { BootScene } from "./scenes/BootScene.js";
import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { GameLoadScene } from "./scenes/GameLoadScene.js";
import { ChatScene } from "./scenes/ChatScene.js";

let gameConfig: GameConfig = {
    title: "B.R.T.D.",
    version: "1.0.0",
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    parent: "game",
    scene: [BootScene, MainMenuScene, GameLoadScene, GameScene, ChatScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 }
        },
        debug: false
    },

    backgroundColor: "#FFFFFF"
};

export { gameConfig };