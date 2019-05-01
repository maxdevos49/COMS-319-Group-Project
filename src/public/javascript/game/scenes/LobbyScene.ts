import { Button } from "../gui/Button.js";
import { GameConnection } from "../GameConnection.js";

const font: string = "november";

export class LobbyScene extends Phaser.Scene {
    public gameSocket: GameConnection;
    private adminStartButton: Button;
    private titleText: Phaser.GameObjects.BitmapText;

    constructor() {
        super({ key: "LobbyScene" });
    }

    init(): void {
        this.titleText = this.add.bitmapText(0, 100, "november", "Lobby", 40);
        this.titleText.setX((this.sys.canvas.width / 2) - (this.titleText.getTextBounds().local.width / 2));

        this.cameras.main.setBackgroundColor(0x611717);
        this.gameSocket = new GameConnection();
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
        this.adminStartButton.addOnClickListener(() => {
            // TODO: send start signal to /games/start
        });
    }
}
