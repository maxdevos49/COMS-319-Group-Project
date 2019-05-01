import { GameConnection } from "../GameConnection.js";
import { Player } from "../objects/Player.js";
import { AlienShooter } from "../objects/AlienShooter.js";
import { GameScene } from "./GameScene.js";

export class GameLoadScene extends Phaser.Scene {

    /**
     * Socket Connection Object
     */
    public connection: GameConnection;

    startedGame: boolean;

    constructor() {
        super({ key: "GameLoadScene" });
    }

    init(info: {id: string}): void {
        this.connection = new GameConnection(info.id);
        this.startedGame = false;
    }

    preload(): void {
        this.scene.remove("GameScene");
    }

    create(): void {
        Player.createAnimations(this.anims);
        AlienShooter.createAnimations(this.anims);
    }

    update(): void {
        if (this.connection.requiredRecieved && !this.startedGame) {
            this.scene.add("GameScene", GameScene, true, this.connection);
            this.startedGame = true;
        }
    }
}
