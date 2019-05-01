export class BootScene extends Phaser.Scene {
	constructor() {
		super({
			key: "BootScene"
		});
	}

	preload(): void {
		// Load graphics for the main menu here
		// Loading animation setup will also go here
		this.load.bitmapFont('november', '/res/November.png', '/res/November.fnt');
        this.load.atlas("sprites", "/res/spritesAtlas.png", "/res/spritesAtlas.json");
        this.load.image("tiles", "/res/tiles.png");
        this.load.image("Default", "/res/Default.png");
	}

	update(): void {
		this.scene.start("MainMenuScene");
	}
}