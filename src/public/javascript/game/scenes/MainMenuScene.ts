import { Button } from "../gui/Button.js";

export class MainMenuScene extends Phaser.Scene {
    private titleText: Phaser.GameObjects.BitmapText;
    private joinGameButton: Button;

    private helpButton: Button;

    private recs: Phaser.GameObjects.Rectangle[];
    private speed: number[];
    private colors: number[];

    constructor() {
        super({
            key: "MainMenuScene"
        });
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
            this.speed.push(ranRan(2) + 10);
            this.add.existing(this.recs[i]);
        }

        // Title of the game
        this.titleText = this.add.bitmapText(0, 100, "november", "B.R.T.D", 70);
        this.titleText.setX((this.sys.canvas.width / 2) - (this.titleText.getTextBounds().local.width / 2));
        // Enter game button
        this.joinGameButton = new Button(this, (this.sys.canvas.width / 2) - 100, 250, 200, 55, "november", "Join Game", 30);
        this.joinGameButton.addOnClickListener(() => {
            this.scene.start("LobbyScene");
        });

        this.helpButton = new Button(this, (this.sys.canvas.width / 2) - 100, 350, 200, 55, "november", "Controls", 30);

        this.helpButton.addOnClickListener(() => {
            this.scene.start("ControlsScene");
        });

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
}



function ranRan(range: number): number {
    return Math.floor(Math.random() * range);
}
