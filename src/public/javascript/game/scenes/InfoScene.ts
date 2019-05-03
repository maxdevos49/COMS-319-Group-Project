
export class InfoScene extends Phaser.Scene {

    /**
     * The mask used to signify damage or danger
     */
    private damageMask: Phaser.GameObjects.Sprite;

    private healthText: Phaser.GameObjects.BitmapText;
    private healthBackground: Phaser.GameObjects.Rectangle;
    private healthBar: Phaser.GameObjects.Rectangle;
    private healthBar2: Phaser.GameObjects.Rectangle;

    private healthBarWidth: number = 296;

    constructor() {
        super({ key: "InfoScene" });
    }

    /**
     * Add the info text to the screen
     */
    init() {
        this.damageMask = new Phaser.GameObjects.Sprite(this, 1280 / 2, 720 / 2, "sprites", "mask");
        this.add.existing(this.damageMask);
        this.damageMask.z = 0;
        this.damageMask.tint = 0xff0000;
        this.damageMask.alpha = 0;

        //Health
        this.healthBackground = new Phaser.GameObjects.Rectangle(this, 0, 0, 300, 40, 0x000000, 0.3);
        this.healthBackground.setOrigin(0, 0);
        this.add.existing(this.healthBackground);

        this.healthBar2 = new Phaser.GameObjects.Rectangle(this, 2, 2, 296, 36, 0xff0000, 0.5);
        this.healthBar2.setOrigin(0, 0);
        this.add.existing(this.healthBar2);

        this.healthBar = new Phaser.GameObjects.Rectangle(this, 2, 2, 296, 36, 0xff0000, 0.8);
        this.healthBar.setOrigin(0, 0);
        this.add.existing(this.healthBar);

        this.healthText = new Phaser.GameObjects.BitmapText(this, 5, 6, "november", `HP: 100`, 30);
        this.add.existing(this.healthText);

    }

    preload() {
        this.setUpListeners();
    }

    private setUpListeners(): void {
        this.scene.get("GameScene").events.on("setHP", (hp: number) => {
            this.add.tween({
                targets: this.healthBar2,
                width: this.healthBarWidth / 100 * hp,
                duration: 500,
                ease: "quadratic"
            });

            this.add.tween({
                targets: this.damageMask,
                alpha: 0.6,
                duration: 100,
                yoyo: true
            });

            this.healthBar.width = this.healthBarWidth / 100 * hp;
            this.healthText.setText(`HP: ${hp}`);
        });

        this.scene.get("GameScene").events.on("setDamageAlpha", (alpha: number) => {
            this.add.tween({
                targets: this.damageMask,
                alpha: alpha,
                duration: 500
            });
        });
    }
}
