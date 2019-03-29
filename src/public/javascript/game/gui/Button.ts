export class Button extends Phaser.GameObjects.Container {
    /**
     * The hitbox that listens for mouse inputs on the button
     */
    private hitbox: Phaser.GameObjects.Zone;
    /**
     * The background of the button
     */
    private background: Phaser.GameObjects.Rectangle;
    /**
     * The text the button contains
     */
    private text: Phaser.GameObjects.BitmapText;
    /**
     * An array of callback functions to call when the button is pressed
     */
    private onClickListeners: (() => any)[];

    /**
     * Constructs a new button that exists in the given scene
     * @param scene The scene that the new button is to exist in
     * @param x The x coordinate in pixels of the top left corner of the button
     * @param y The y coordinate in pixels of the top left corner of the button
     * @param width The width of the button in pixels
     * @param height The height of the button in pixels
     * @param fontName The name of the bitmap font to use
     * @param text The text of the button
     * @param fontSize The font size of the button
     */
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, fontName: string, text: string, fontSize: number) {
        super(scene, x, y);
        // Add the hitbox that listens for mouse input
        this.hitbox = new Phaser.GameObjects.Zone(scene, (width / 2), (height / 2), width, height);
        this.hitbox.setInteractive();
        this.add(this.hitbox);
        // Add the backgronud of the button
        this.background = new Phaser.GameObjects.Rectangle(scene, (width / 2), (height / 2), width, height, 0x5e5e5e);
        this.background.setStrokeStyle(2, 0x000000);
        this.add(this.background);
        // Add the text of the button and center it inside of it
        this.text = new Phaser.GameObjects.BitmapText(scene, 0, 10, fontName, text, fontSize);
        this.text.setX((width - this.text.getTextBounds().local.width) / 2);
        this.add(this.text);
        // Add the button to the scene
        scene.add.existing(this);

        this.addMouseBehaviour();
        this.onClickListeners = [];
    }
    /**
     * Adds the listeners and behaviours to take when the mouse acts on the button
     */
    private addMouseBehaviour(): void {
        this.hitbox.on("pointerover", (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Input.EventData) => {
           this.background.setFillStyle(0x808080);
        });
        this.hitbox.on("pointerout", (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Input.EventData) => {
            this.background.setFillStyle(0x5e5e5e);
        });
        this.hitbox.on("pointerdown", (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Input.EventData) => {
            this.onClickListeners.forEach((listener: () => any) => listener());
        });
    }
    /**
     * Adds a callback function that will be called when the button is pressed
     * @param listener The callback function that will be called when the button is pressed
     */
    public addOnClickListener(listener: () => any) {
        this.onClickListeners.push(listener);
    }
}