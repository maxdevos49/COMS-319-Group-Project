import Scene = Phaser.Scene;

const TEXT_INPUT_FIELD_ALLOWED_CHARACTERS: string[] = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789?!.,@#$%^&*()-=+_[]{};':\"/<>?\\|".split('');

export class TextInputField extends Phaser.GameObjects.Container {
    /**
     * The box which mouse inputs are listened for
     */
    hitBox: Phaser.GameObjects.Zone;
    /**
     * The aesthetic background to the text box
     */
    background: Phaser.GameObjects.Rectangle;
    /**
     * Text text object which renders the text that has been input onto the screen
     */
    text: Phaser.GameObjects.BitmapText;
    /**
     * Whether this text field is currently selected. If true character inputs will be captured by the input field
     */
    selected: boolean;

    /**
     *
     * @param scene The scene which this text input field will be added to
     * @param x The y coordinate of the top right corner of the field
     * @param y The x coordinate of the top left corner of the field
     * @param width The width in pixels of the game
     * @param height The height in pixels of the game
     * @param fontName The name of the bitmap font to use
     * @param fontSize Optional font size argument, default size = 40
     */
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, fontName: string, fontSize: number = 40) {
        super(scene, x, y);
        // Add area mouse inputs are listened in
        this.hitBox = new Phaser.GameObjects.Zone(scene, (width / 2), (height / 2), width, height);
        this.add(this.hitBox);
        // Add the background
        this.background = new Phaser.GameObjects.Rectangle(scene,  (width / 2), (height / 2), width, height, 0x808080);
        this.background.setStrokeStyle(2, 0x000000);
        this.add(this.background);
        // Add the text display
        this.text = new Phaser.GameObjects.BitmapText(scene, 10, 10, fontName, "", fontSize);
        this.add(this.text);
        // Add to the scene
        scene.add.existing(this);

        this.selected = false;

        this.addMouseListener(scene);
        this.addKeyboardListeners(scene);
    }

    /**
     * Adds a mouse listener to the given scene that listens for when the text input box is selected
     * @param scene The scene to add the mouse listener to
     */
    private addMouseListener(scene: Scene): void {
        // Add mouse listener that tracks whether the field is selected
        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            // Pointer was clicked outside of the zone
            if (!this.hitBox.getBounds().contains(pointer.x, pointer.y)) {
                this.selected = false;
            } else {
                this.selected = true;
            }
        });
    }

    /**
     * Adds the key listeners that listen for text input into the text input box
     * @param scene The scene to add the keyboard listeners to
     */
    private addKeyboardListeners(scene: Scene): void {
        scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            if (this.selected) {
                if (TEXT_INPUT_FIELD_ALLOWED_CHARACTERS.includes(event.key)) {
                    this.text.setText(this.text.text + event.key);
                    // Check if adding this character has exceed the allowed bounds and remove if it does
                    if (this.text.getTextBounds().global.width > (this.hitBox.width - 20)) {
                        this.text.setText(this.text.text.slice(0, -1));
                    }
                } else if ("Backspace" === event.key) {
                    this.text.setText(this.text.text.slice(0, -1));
                }
            }
        });
    }

}