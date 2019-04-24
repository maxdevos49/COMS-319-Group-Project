export class InfoScene extends Phaser.Scene {
    /**
     * A map of labels and values to be dispalyed on the screen.
     */
    public infoItems: Map<string, string> = new Map([
        ["HP", "100"],
    ]);;

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
     * Add the info text to the screen and listen for updates.
     */
    init() {
        let x = 5;
        let y = 10;
        this.infoItems.forEach((value: string, label: string) => {
            const textObj = this.add.text(x, y, `${label}: ${value}`, this.config);
            this.textReferences.set(label, textObj);
            y += 50;
        });

        this.setUpListeners();
    }

    private setUpListeners(): void {
        this.scene.get("GameScene").events.on("setHP", (hp: number) => {
            this.updateInfo("HP", String(hp));
        });
    }

    private updateInfo(label: string, value: string): void {
        this.infoItems.set(label, value);
        this.textReferences.get(label).setText(`${label}: ${value}`);
    }
}
