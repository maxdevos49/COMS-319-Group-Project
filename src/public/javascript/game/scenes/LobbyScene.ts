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


    private recs: Phaser.GameObjects.Rectangle[];
    private speed: number[];
    private colors: number[];

    private bac: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: "LobbyScene" });

        this.recs = [];
        this.speed = [];
        this.colors = [0xff0000, 0x00ff00, 0x0000ff];
    }

    preload(): void {
        let height = this.cameras.main.height;
        let width = this.cameras.main.width;

        this.recs = [];
        this.speed = [];
        for (let i = 0; i < 40; i++) {
            this.recs.push(new Phaser.GameObjects.Rectangle(this, ranRan(width), ranRan(height), ranRan(200) + 20, ranRan(50) + 10, this.colors[ranRan(3)], Math.random()));
            this.recs[i].setOrigin(0, 0);
            this.speed.push(ranRan(2) + 5);
            this.add.existing(this.recs[i]);
        }

        this.bac = new Phaser.GameObjects.Rectangle(this, width / 2 - 450/2, height / 2 - 300, 450, 630, 0x000000);
        this.bac.setOrigin(0, 0);
        this.bac.setStrokeStyle(2, 0xffffff);
        this.add.existing(this.bac);

        this.titleText = this.add.bitmapText(0, 100, font, "Lobby", 60);
        this.titleText.setX((this.sys.canvas.width / 2) - (this.titleText.getTextBounds().local.width / 2));

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

    public update(): void {
        let height = this.cameras.main.height;
        let width = this.cameras.main.width;

        for (let i = 0; i < 40; i++) {
            this.recs[i].x += this.speed[i];
            if (this.recs[i].x > width + this.recs[i].width) {
                this.recs[i].x = 0 - this.recs[i].width;
                this.recs[i].y = ranRan(height);
            }
        }
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

function ranRan(range: number): number {
    return Math.floor(Math.random() * range);
}