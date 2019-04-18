


export class Chat extends Phaser.GameObjects.Container {

    /**
     * The Background GameObject of a chat message for contrast
     */
    private backgroundObject: Phaser.GameObjects.Rectangle;

    /**
     * The Text GameObject that displays the text
     */
    private textObject: Phaser.GameObjects.BitmapText;

    /**
     * The font type
     */
    public fontType: string;

    /**
     * The font size
     */
    public fontSize: number;

    /**
     *The text the chat contains
     */
    public text: string;

    /**
     *The decay rate in milliseconds
     */
    public decay: number;

    /**
     * The maximum character width allowed in a single line
     */
    private charWidth: number;

    /**
     * Contructs a Chat message.
     * @param givenScene
     * @param config
     */
    constructor(givenScene: Phaser.Scene, config: IChatConfig) {
        super(givenScene, config.x, config.y);

        //set properties
        this.text = config.text;
        this.width = config.width;
        this.height = config.height;
        this.fontType = config.fontType;
        this.fontSize = config.fontSize;
        this.decay = config.decay;
        this.charWidth = config.charWidth;

        //Background GameObject
        this.backgroundObject = new Phaser.GameObjects.Rectangle(givenScene, 0, 0, this.width, this.height, 0x000000, 0.3);
        this.backgroundObject.setOrigin(0, 0);

        //Text GameObject
        this.text = this.breakupText(this.text)
        this.textObject = new Phaser.GameObjects.BitmapText(givenScene, 2, 2, this.fontType, this.text, this.fontSize);
        this.backgroundObject.height = this.textObject.getTextBounds(true).global.height + 4;
        this.textObject.setAlpha(0.8);

        //add to scene
        this.add([this.backgroundObject, this.textObject]);
        givenScene.add.existing(this);

        //set decay
        setTimeout(() => { this.fadeOut(); }, this.decay);
    }

    public getHeight(): number {
        return this.backgroundObject.height;
    }

    /**
     * Shows the chat
     */
    public show(): void {
        this.setVisible(true);
    }

    /**
     * Hides chat
     */
    public hide(): void {
        this.setVisible(false);
    }

    /**
     * Breaks chat into multiple lines based on its width
     */
    public breakupText(givenText: string): string {
        if (givenText.length > this.charWidth) {
            let p: number = this.charWidth

            for (; p > 0 && givenText[p] != ' '; p--);

            if (p > 0) {
                let left: string = givenText.substring(0, p);
                let right: string = givenText.substring(p + 1);
                return left + "\n" + this.breakupText(right);
            }
        }
        return givenText;
    }

    /**
     * Fades the chat from the screen
     */
    public fadeOut(): void {
        this.scene.add.tween({
            targets: [this],
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 0,
            alpha: {
                getStart: () => this.alpha,
                getEnd: () => 0
            },
            onComplete: () => {
                this.setVisible(false);
                this.alpha = 1;
            }
        });
    }
}


/**
 * Configuration interface for Chat GameObjects
 */
export interface IChatConfig {

    /**
     * The x position to place the chat
     */
    x: number;

    /**
     * The y position to place the chat
     */
    y: number;

    /**
     * The Chat Width
     */
    width: number;

    /**
     * The Height of the chat
     */
    height: number;

    /**
     * The text to display in the chat
     */
    text: string;

    /**
     * The font to use for the text
     */
    fontType: string;

    /**
     * Font size of the text
     */
    fontSize: number;

    /**
     * The time it will take for the chat to fade out and decay in milliseconds
     */
    decay: number;

    /**
     * The maximum character width before the chat wraps
     */
    charWidth: number;
}