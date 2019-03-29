import { GameConnection } from "../GameConnection.js";

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
        // Load game components here
        // Animation will also go here
        this.add.text(10, 10, "Your name is: " + this.registry.get("name"), {
            fill: "0xFF0000"
        });

        this.gameSocket.addNickName(this.registry.get("name"));
    }
}
