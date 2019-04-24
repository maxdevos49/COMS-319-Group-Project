export class InfoScene extends Phaser.Scene {
    /**
     * Text to be displayed on screen so that the player knows how much HP
     * is left.
     */
    public hp: string;

    constructor() {
        super({ key: "InfoScene", active: true });
        this.hp = "100";
    }

    /**
     * Add the info text and listen for updates.
     *
     * TODO: Refactor to handle multiple lines of HUD information.
     */
    create() {
        const info = this.add.text(10, 10, "HP: " + this.hp, { font: "48px november", fill: "#000000" });
        this.scene.get("GameScene").events.on("setHP", (hp: number) => {
            this.hp = String(hp);
            info.setText("HP: " + this.hp);
        });
    }
}
