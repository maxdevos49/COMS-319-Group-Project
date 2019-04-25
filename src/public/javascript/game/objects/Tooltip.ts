export class ToolTip extends Phaser.GameObjects.Container {

    private proximityRadius?: number;

    private tipName: string;

    private tip: string;

    private background: Phaser.GameObjects.Rectangle;

    private text: Phaser.GameObjects.BitmapText;

    constructor(givenScene: Phaser.Scene, config: IToolTipConfig) {
        super(givenScene, config.x, config.y - config.fontSize * 3);

        //Properties
        this.tipName = config.name;
        this.tip = config.tip;

        //text
        this.text = new Phaser.GameObjects.BitmapText(this.scene, 0, 0, config.font, this.tipName + " | " + this.tip, config.fontSize);
        this.text.setOrigin(0.5, 0.5);

        //background
        this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.text.getTextBounds().global.width + 4, config.fontSize, 0x000000, 0.4);

        //add to scene
        this.add([this.background, this.text]);
        this.scene.add.existing(this);
    }


    public fadeIn(): void {
        this.setVisible(true);
        this.scene.add.tween({
            targets: [this],
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 0,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            onComplete: () => {
                this.alpha = 1;
            }
        });
    }

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

export interface IToolTipConfig {

    /**
     * The horzontal location of the tooltip
     */
    x: number;

    /**
     * The vertical location of the tooltip
     */
    y: number;

    /**
     * The name the tooltip will show
     */
    name: string;

    /**
     * The instruction the tooltip will suggest
     */
    tip: string;

    /**
     * The font to use for the tooltip
     */
    font: string;

    /**
     * The size of the font to use for the tooltip
     */
    fontSize: number;

}