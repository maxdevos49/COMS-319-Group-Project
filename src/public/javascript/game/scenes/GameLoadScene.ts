import { GameConnection } from "../GameConnection.js";
import { Player } from "../objects/Player.js";
import { AlienShooter } from "../objects/AlienShooter.js";

export class GameLoadScene extends Phaser.Scene {

    /**
     * Socket Connection Object
     */
    public gameSocket: GameConnection;

    constructor() {
        super({ key: "GameLoadScene" });
    }

    preload(): void {
        this.load.atlas("sprites", "/res/spritesAtlas.png", "/res/spritesAtlas.json");
        this.load.image("tiles", "/res/tiles.png");
        this.load.image("Default", "/res/Default.png");
        this.gameSocket = new GameConnection();
    }

    create(): void {
        Player.createAnimations(this.anims);
        AlienShooter.createAnimations(this.anims);
    }

    update(): void {
        if (this.gameSocket.ready) {
            this.scene.start("GameScene", this.gameSocket);
        }
    }
}
