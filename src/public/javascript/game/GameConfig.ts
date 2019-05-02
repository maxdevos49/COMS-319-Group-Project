import { BootScene } from "./scenes/BootScene.js";
import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { LobbyScene } from "./scenes/LobbyScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { GameLoadScene } from "./scenes/GameLoadScene.js";
import { ChatScene } from "./scenes/ChatScene.js";
import { InfoScene } from "./scenes/InfoScene.js";
import { EndScene } from "./scenes/EndScene.js";

let gameConfig: GameConfig = {
    title: "B.R.T.D.",
    version: "2.0.0",
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
    },
    parent: "game",
    scene: [
        BootScene,
        MainMenuScene,
        LobbyScene,
        GameLoadScene,
        ChatScene,
        InfoScene,
        EndScene,
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { x: 0, y: 0 }
        },
    },

    backgroundColor: "#000000"
};

export { gameConfig };
