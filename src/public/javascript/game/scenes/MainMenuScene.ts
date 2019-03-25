export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MainMenuScene"
        });
    }

    preload(): void {
        this.add.text(100, 100, "You are now in the main menu!", {color: "#f10006"});
    }
}