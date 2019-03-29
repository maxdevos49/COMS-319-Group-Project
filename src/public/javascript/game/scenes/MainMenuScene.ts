import {TextInputField} from "../gui/TextInputField.js";
import {Button} from "../gui/Button.js";

export class MainMenuScene extends Phaser.Scene {
    nameField: TextInputField;
    titleText: Phaser.GameObjects.BitmapText;
    enterNameText: Phaser.GameObjects.BitmapText;
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
        // Enter name text
        this.enterNameText = this.add.bitmapText(0, 250, "november", "Please enter your name:", 40);
        this.enterNameText.setX((this.sys.canvas.width / 2) - (this.enterNameText.getTextBounds().local.width / 2));
        // Text field for the name
        this.nameField = new TextInputField(this, (this.sys.canvas.width / 2) - 300, 300, 440, 55, "november", 40);
        // Enter game button
        this.joinGameButton = new Button(this, (this.sys.canvas.width / 2) + 150, 300, 140, 55, "november", "Join Game", 30);
        this.joinGameButton.addOnClickListener(() => {
           this.scene.start("GameLoadScene");
        });
    }
}