import { Button } from "../gui/Button.js";
import { PlayerInfo } from "../models/PlayerInfo.js";

const font: string = "november";

export class LobbyScene extends Phaser.Scene {
    private titleText: Phaser.GameObjects.BitmapText;

    /**
     * The button that the admin can use to force start the game.
     */
    private adminStartButton: Button;

    /**
     * Map of player ID to its text object in the lobby.
     */
    private players: Map<string, Phaser.GameObjects.BitmapText> = new Map();

    // private players:

    /**
     * The Y position where we start placing the player names.
     */
    private playerTextYPosition: number = 200;

    /**
     * The socket connection to the game matchmaking server
     */
    private matchmakingSocket: SocketIOClient.Socket;

    constructor() {
        super({ key: "LobbyScene" });
    }

    init(): void {
        this.titleText = this.add.bitmapText(0, 100, font, "Lobby", 60);
        this.titleText.setX((this.sys.canvas.width / 2) - (this.titleText.getTextBounds().local.width / 2));
        this.cameras.main.setBackgroundColor(0x611717);
    }

    preload(): void {
        this.playerTextYPosition = 200;

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
        this.matchmakingSocket = io("/games", { reconnection: false });

        this.matchmakingSocket.on("/update/new/player", (info: PlayerInfo) => {
            const text = info.name + ' (' + info.role + ')';
            const nameTextObj = this.add.bitmapText(0, this.playerTextYPosition, font, text, 40);
            nameTextObj.setX((this.sys.canvas.width / 2) - (nameTextObj.getTextBounds().local.width / 2));
            console.log('player update received: ' + info.id);
            this.players.set(info.id, nameTextObj);
            this.playerTextYPosition += 50;
        });

        this.matchmakingSocket.on("/update/remove/player", (id: string) => {
            console.log('remove update received: ' + id);
            const removedY = this.players.get(id).originY;
            if (this.players.delete(id)) {
                // Shift player names up when one leaves
                this.players.forEach((textObj) => {
                    if (textObj.originY > removedY) {
                        textObj.y -= 50
                    }
                });
            }
        });

        this.matchmakingSocket.on("/update/role", (role: string) => {
            console.log("Role: " + role);
            if (role == "admin") {
                this.adminStartButton.setVisible(true);
            }
        });

        this.matchmakingSocket.on("/update/start", (id: string) => {
            this.matchmakingSocket.disconnect();
            this.scene.start("GameLoadScene", { id: id });
        });
    }
}
