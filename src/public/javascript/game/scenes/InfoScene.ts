import Sprite = Phaser.GameObjects.Sprite;
import Tween = Phaser.Tweens.Tween;

export class InfoScene extends Phaser.Scene {

    /**
     * The mask used to signify damage or danger
     */
    damageMask: Sprite;

    /**
     * A map of labels and values to be dispalyed on the screen.
     */
    public infoItems: Map<string, string> = new Map([
        ["HP", "100"],
    ]);

    /**
     * References to the Phaser text objects which are needed for updating the
     * text.
     */
    public textReferences: Map<string, Phaser.GameObjects.Text> = new Map();

    /**
     * Configuration for the text.
     */
    public config: Object = {
        font: "48px november",
        fill: "#fff",
        backgroundColor: "#000",
    };

    constructor() {
        super({ key: "InfoScene" });
    }

    /**
     * Add the info text to the screen
     */
    init() {
        this.damageMask = this.add.sprite(1280 / 2, 720 / 2, "sprites", "mask");
        this.damageMask.z = 0;
        this.damageMask.tint = 0xff0000;
        this.damageMask.alpha = 0;

        let x = 5;
        let y = 10;
        this.infoItems.forEach((value: string, label: string) => {
            const textObj = this.add.text(x, y, `${label}: ${value}`, this.config);
            textObj.z = 1;
            this.textReferences.set(label, textObj);
            y += 50;
        });
    }

    preload() {
        this.setUpListeners();
    }

    private setUpListeners(): void {
        this.scene.get("GameScene").events.on("setHP", (hp: number) => {
            this.updateInfo("HP", String(hp));
        });

        this.scene.get("GameScene").events.on("setDamageAlpha", (alpha: number) => {
            this.add.tween({
                targets: this.damageMask,
                alpha: alpha,
                duration: 500
            });
        });
    }

    private updateInfo(label: string, value: string): void {
        this.infoItems.set(label, value);
        this.textReferences.get(label).setText(`${label}: ${value}`);
    }
}
