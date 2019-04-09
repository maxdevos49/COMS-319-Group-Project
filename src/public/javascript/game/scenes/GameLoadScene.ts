import { GameConnection } from "../GameConnection.js";
import {Player} from "../objects/Player.js";

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
		this.gameSocket = new GameConnection();
    }

    create(): void {
        Player.createAnimations(this.anims);
    }

    update(): void {
        if (this.gameSocket.ready) {
			this.scene.start("GameScene", this.gameSocket);
        }
    }
}
