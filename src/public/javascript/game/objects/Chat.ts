export class Chat {

    /**
     * The background of a chat message for contrast
     */
    private backgroundObject: Phaser.GameObjects.Rectangle;

    /**
     * The Text Game Object that displays the text
     */
    private textObject: Phaser.GameObjects.BitmapText;

    /**
     * The position of the entire Chat Object
     */
    public position: Phaser.Math.Vector2;

    /**
     *The text the chat contains
     */
    public text: string;

    /**
     * The amount of steps before the chat fades away
     */
    private viewTimer: number;

    /**
     * Determins if the chat is currently shown or not
     */
    private isShown: boolean;

    /**
     * Constructs a Chat GameObject
     * @param givenScene
     * @param givenX
     * @param givenY
     * @param givenText
     */
    constructor(givenScene: Phaser.Scene, givenX: number, givenY: number, givenText: string) {

        //set properties
        this.position = new Phaser.Math.Vector2(givenX, givenY);
        this.text = givenText;
        this.viewTimer = 3000;
        this.isShown = true;

        //Background GameObject
        this.backgroundObject = new Phaser.GameObjects.Rectangle(givenScene, givenX, givenY, 600, 22, 100, 0.2);
        this.backgroundObject.setOrigin(0, 0);
        givenScene.add.existing(this.backgroundObject);

        //Text GameObject
        this.textObject = new Phaser.GameObjects.BitmapText(givenScene, givenX, givenY, "november", givenText, 22);
        this.textObject.setAlpha(0.5);
        givenScene.add.existing(this.textObject);
    }

    public show(): void {

    }

    public hide(): void {

    }

    public stepTimer(): void {

    }

    public destroy(): void {

    }

    public setPosition(givenX: number, givenY: number): void {

    }

}