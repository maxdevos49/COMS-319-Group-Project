
/**
 * Allowed Characters
 * Inaccurate due to not all exiting on sprite
 */
const ALLOWED_CHARACTERS: string[] = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890?!.,@#$%^&*()-=+_[]{};':\"/?\\|".split('');


export class ChatInput extends Phaser.GameObjects.Container {

    /**
     * The fontSize of the text
     */
    public fontSize: number;

    /**
     * The font Type of the test
     */
    public fontType: string;

    /**
     * Determines if the input is active
     */
    public isActive: boolean;

    /**
     * The background for the text area.
     */
    public background: Phaser.GameObjects.Rectangle;

    /**
     * The Text you are typing into the text box.
     */
    public text: Phaser.GameObjects.BitmapText;


    /**
     * Contructs a ChatInput
     * @param givenScene
     * @param config
     */
    constructor(givenScene: Phaser.Scene, config: IChatInputConfig) {
        super(givenScene, config.x, config.y);

        //give access to chat window here or add event listeners to the window "backpace" and "enter" keys

        //properties
        this.width = config.width;
        this.height = config.height;
        this.fontSize = config.fontSize;
        this.fontType = config.fontType;
        this.isActive = false;

        //GameObjects
        this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.width, this.height, 0x000000, 0.4);
        this.text = new Phaser.GameObjects.BitmapText(this.scene, 2, 2, this.fontType, "", this.fontSize);

        //add to scene
        this.add([this.background, this.text]);
        this.background.setOrigin(0, 0);
        this.scene.add.existing(this);

        this.addKeyboardListener();
        this.toInactive();

    }

    /**
     *The Keyboard listener for the chat
     */
    private addKeyboardListener(): void {

        this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            event.preventDefault();

            if (this.isActive) {
                if (ALLOWED_CHARACTERS.includes(event.key)) {
                    this.text.setText(this.text.text + event.key);

                    //If the chat is longer then line
                    if (this.text.getTextBounds(true).global.width > this.width) {
                        this.text.x = this.width - this.text.getTextBounds(true).global.width
                    } else {
                        this.text.x = 0;
                    }
                } else if ("Backspace" === event.key) {
                    this.text.setText(this.text.text.slice(0, -1));

                    //If the chat is longer then line
                    if (this.text.getTextBounds(true).global.width > this.width) {
                        this.text.x = this.width - this.text.getTextBounds(true).global.width
                    } else {
                        this.text.x = 0;
                    }
                }
            }

        });
    }

    public toInactive(): void {
        this.isActive = false;
        this.setVisible(false);
    }

    public toActive(): void {
        this.isActive = true;
        this.setVisible(true);
    }

}

export interface IChatInputConfig {
    x: number;

    y: number;

    width: number;

    height: number;

    fontType: string;

    fontSize: number;
}