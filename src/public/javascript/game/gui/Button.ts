export class Button extends Phaser.GameObjects.Container {

    background: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, fonrtName: string, text: string) {
        super(scene, x, y);

        this.background = new Phaser.GameObjects.Rectangle(scene, x, y, width, height, 0x5e5e5e);
        this.add(this.background);

        scene.add.existing(this);

    }
}