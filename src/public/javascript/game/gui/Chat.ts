


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
     *The text the chat contains
     */
    public text: string;

    /**
     *The decay rate in milliseconds
     */
    public decay: number;

    /**
     * Contructs a Chat message.
     * @param givenScene
     * @param config
     */
    constructor(givenScene: Phaser.Scene, config: IChatConfig) {
        super(givenScene, config.x, config.y);

        //set properties
        this.text = config.text;
        this.decay = config.decay || 5000;

        //Background GameObject
        this.backgroundObject = new Phaser.GameObjects.Rectangle(givenScene, 0, 0, 600, 22, 100, 0.2);
        this.backgroundObject.setOrigin(0, 0);

        //Text GameObject
        this.textObject = new Phaser.GameObjects.BitmapText(givenScene, 0, 0, config.font || "november", config.text, 22);
        this.textObject.setAlpha(0.5);

        //add children
        this.add([this.backgroundObject, this.textObject]);

        //add to scene
        givenScene.add.existing(this);

        //set decay
        setTimeout(() => { this.fadeOut(); }, this.decay);
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
     * The text to display in the chat
     */
    text?: string;

    /**
     * The font to use for the text
     */
    font?: string;

    /**
     * Font size of the text
     */
    fontSize?: number;

    /**
     * The time it will take for the chat to fade out and decay in milliseconds
     */
    decay?: number;
}