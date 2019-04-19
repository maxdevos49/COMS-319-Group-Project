export class Chat extends Phaser.GameObjects.BitmapText {

    constructor(scene: Phaser.Scene, text: string) {
        super(scene, 0, 0, "");
        scene.physics.world.enable(this);
        //this.text = new Phaser.GameObjects.BitmapText(scene, 10, 10, fontName, "", fontSize);

        // this.id = description.id;
        // this.ownerId = description.ownerId;
        // this.setRotation(description.angle);
    }

}