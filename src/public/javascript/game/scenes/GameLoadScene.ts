import { GameConnection } from "../GameConnection.js";
import { Player } from "../objects/Player.js";
import { AlienShooter } from "../objects/AlienShooter.js";

export class GameLoadScene extends Phaser.Scene {

    /**
     * Socket Connection Object
     */
    public connection: GameConnection;

    constructor() {
        super({ key: "GameLoadScene" });
    }

    init(info: {id: string}): void {
        this.connection = new GameConnection(info.id);
    }

    preload(): void {
        this.load.atlas("sprites", "/res/spritesAtlas.png", "/res/spritesAtlas.json");
        this.load.image("tiles", "/res/tiles.png");
        this.load.image("Default", "/res/Default.png");
    }

    create(): void {
        Player.createAnimations(this.anims);
        AlienShooter.createAnimations(this.anims);
    }

    update(): void {
        if (this.connection.ready) {
            this.scene.start("GameScene", this.connection);
        }
    }
}
