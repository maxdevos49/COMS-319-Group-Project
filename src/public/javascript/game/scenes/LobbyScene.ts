import { Button } from "../gui/Button.js";
import { GameConnection } from "../GameConnection.js";
import { GameLoadScene } from "./GameLoadScene";
import { PlayerInfo } from "../models/PlayerInfo";

const font: string = "november";

export class LobbyScene extends Phaser.Scene {
    private adminStartButton: Button;
    private titleText: Phaser.GameObjects.BitmapText;

    /**
     * The socket connection to the game matchmaking server
     */
    private matchmakingSocket: SocketIOClient.Socket;

    constructor() {
        super({ key: "LobbyScene" });
    }

    init(): void {
        this.titleText = this.add.bitmapText(0, 100, "november", "Lobby", 40);
        this.titleText.setX((this.sys.canvas.width / 2) - (this.titleText.getTextBounds().local.width / 2));

        this.cameras.main.setBackgroundColor(0x611717);
    }

    preload(): void {
        this.adminStartButton = new Button(
            this,
            (this.sys.canvas.width / 2) - 100,
            600,
            200,
            55,
            font,
            "Force Start",
            30
        );
        this.adminStartButton.setVisible(false);
        this.adminStartButton.addOnClickListener(() => {
            this.matchmakingSocket.emit("/start");
        });

        this.initSocket();
    }

    private initSocket(): void {
        this.matchmakingSocket = io("/games");

        this.matchmakingSocket.on("/update/new/player", (info: PlayerInfo) => {
           // TODO: Handle new player
        });

        this.matchmakingSocket.on("/update/remove/player", (id: string) => {
           // TODO: Handle remove player
        });

        this.matchmakingSocket.on("/update/role", (role: string) => {
            console.log("Role: " + role);
            if (role == "admin") {
                this.adminStartButton.setVisible(true);
            }
        });

        this.matchmakingSocket.on("/update/start", (id: string) => {
            this.matchmakingSocket.disconnect();
            this.scene.start("GameLoadScene", {id: id});
        });
    }
}
