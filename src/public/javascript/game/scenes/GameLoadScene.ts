export class GameLoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameLoadScene"
        });
    }

    preload(): void {
        // Load game components here
        // Animation will also go here
        this.add.text(10,10, "You are in the load scene!");
    }
}