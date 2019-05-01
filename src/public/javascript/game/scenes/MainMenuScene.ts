import { Button } from "../gui/Button.js";

export class MainMenuScene extends Phaser.Scene {
    titleText: Phaser.GameObjects.BitmapText;
    joinGameButton: Button;
    constructor() {
        super({
            key: "MainMenuScene"
        });
    }

    init(): void {
        this.cameras.main.setBackgroundColor(0x611717);
    }

    preload(): void {
        // Title of the game
        this.titleText = this.add.bitmapText(0, 100, "november", "B.R.T.D", 70);
        this.titleText.setX((this.sys.canvas.width / 2) - (this.titleText.getTextBounds().local.width / 2));
        // Enter game button
        this.joinGameButton = new Button(this, (this.sys.canvas.width / 2) - 100, 250, 200, 55, "november", "Join Game", 30);
        this.joinGameButton.addOnClickListener(() => {
            this.scene.start("LobbyScene");
        });
    }
}
