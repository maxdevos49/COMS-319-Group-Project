import { GameConnection } from "../GameConnection.js";
import {Player} from "../objects/Player";

export class GameLoadScene extends Phaser.Scene {
    
    /**
     * Socket Connection Object
     */
    public gameSocket: GameConnection;

    constructor() {
        super({ key: "GameLoadScene" });
        this.gameSocket = new GameConnection();
    }

    preload(): void {
        this.load.atlas("/res/spritesAtlas");

        this.gameSocket.addNickName(this.registry.get("name"));
    }

    create(): void {
        Player.createAnimations(this.anims);

        this.scene.start("GameScene");
    }
}
