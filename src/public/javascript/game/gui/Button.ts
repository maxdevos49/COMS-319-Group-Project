export class Button extends Phaser.GameObjects.Container {

    private hitbox: Phaser.GameObjects.Zone;
    private background: Phaser.GameObjects.Rectangle;
    private text: Phaser.GameObjects.BitmapText;

    private onClickListeners: (() => any)[];

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, fontName: string, text: string, fontSize: number) {
        super(scene, x, y);

        this.hitbox = new Phaser.GameObjects.Zone(scene, (width / 2), (height / 2), width, height);
        this.hitbox.setInteractive();
        this.add(this.hitbox);

        this.background = new Phaser.GameObjects.Rectangle(scene, (width / 2), (height / 2), width, height, 0x5e5e5e);
        this.background.setStrokeStyle(2, 0x000000);
        this.add(this.background);

        this.text = new Phaser.GameObjects.BitmapText(scene, 0, 10, fontName, text, fontSize);
        console.log(this.text.getTextBounds().local.width);
        this.text.setX((width - this.text.getTextBounds().local.width) / 2);
        this.add(this.text);

        scene.add.existing(this);

        this.addMouseBehaviour();
        this.onClickListeners = [];
    }

    public addOnClickListener(listener: () => any) {
        this.onClickListeners.push(listener);
    }

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
}