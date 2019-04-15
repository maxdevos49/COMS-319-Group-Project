import {BootScene} from "./scenes/BootScene.js";
import {MainMenuScene} from "./scenes/MainMenuScene.js";
import {GameScene} from "./scenes/GameScene.js";
import {GameLoadScene} from "./scenes/GameLoadScene.js";
import { b2Filter, b2Fixture } from "../../../../lib/box2d-physics-engine/Dynamics/b2Fixture";

let gameConfig: GameConfig = {
    title: "Example Game",
    version: "0.1",
    width: 1280,
    height: 720,
    type: Phaser.AUTO,
    parent: "game",
    scene: [BootScene, MainMenuScene, GameLoadScene, GameScene],
    physics: {
        default: "arcade",
        arcade: {
            gravity: {x: 0, y: 0}
        },
        debug: false
    },
    backgroundColor: "#FFFFFF"
};

export {gameConfig};