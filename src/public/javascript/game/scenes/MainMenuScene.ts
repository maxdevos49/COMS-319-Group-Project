import {TextInputField} from "../gui/TextInputField.js";

export class MainMenuScene extends Phaser.Scene {
    nameField: TextInputField;

    constructor() {
        super({
            key: "MainMenuScene"
        });
    }

    preload(): void {
        this.nameField = new TextInputField(this, 10, 10, 200, 50);
    }
}