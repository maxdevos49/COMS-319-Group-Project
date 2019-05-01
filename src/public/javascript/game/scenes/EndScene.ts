import { PlayerStats } from "../../../../../src/game/simulation/objects/PlayerStats.js";
import { Button } from "../gui/Button.js";

const font: string = "november";

export class EndScene extends Phaser.Scene {
    gameOverText: Phaser.GameObjects.BitmapText;
    enemiesKilledText: Phaser.GameObjects.BitmapText;
    timeInGameText: Phaser.GameObjects.BitmapText;
    mainMenuButton: Button;

    constructor() {
        super({ key: "EndScene" });
    }

    init(stats: PlayerStats): void {
        this.cameras.main.setBackgroundColor(0x611717);

        const winner: string = "You win!";
        const loser: string = "You lose!";
        const winLoseText: string = stats.finishPlace === 1 ? winner : loser;
        this.gameOverText = this.add.bitmapText(0, 100, font, winLoseText, 70);
        this.gameOverText.setX((this.sys.canvas.width / 2) - (this.gameOverText.getTextBounds().local.width / 2));

        this.enemiesKilledText = this.add.bitmapText(0, 200, font, "Enemies killed: " + stats.enemiesKilled, 20);
        this.enemiesKilledText.setX((this.sys.canvas.width / 2) - (this.enemiesKilledText.getTextBounds().local.width / 2));

        const min: number = Math.floor(stats.secondsInGame / 60);
        const sec: number = Math.round(stats.secondsInGame - (min * 60));
        this.timeInGameText = this.add.bitmapText(0, 240, font, "Time in game: " + min + " minutes " + sec + " seconds", 20);
        this.timeInGameText.setX((this.sys.canvas.width / 2) - (this.timeInGameText.getTextBounds().local.width / 2));

        this.mainMenuButton = new Button(
            this,
            (this.sys.canvas.width / 2) - 100,
            350,
            200,
            55,
            font,
            "Main Menu",
            30
        );

        this.mainMenuButton.addOnClickListener(() => {
            this.scene.remove("InfoScene");
            this.scene.remove("ChatScene")
            this.scene.remove("GameScene");
            this.scene.start("MainMenuScene");
        });
    }
}
