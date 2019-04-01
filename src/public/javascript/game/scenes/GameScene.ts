import {Player} from "../objects/Player.js";
import {GameConnection} from "../GameConnection.js";

export class GameScene extends Phaser.Scene {
    /**
     * The connection to the server
     */
    connection: GameConnection;
    /**
     * The map from id to game object that contains all game objects in the game
     */
    private players: Player[];
    /**
     * A reference to the player that this client is playing
     */
    private clientPlayer: Player;
    constructor() {
        super({
            key: "GameScene"
        });

        this.players = [];
    }

    init(connection: GameConnection): void {
        this.connection = connection;
    }

    create(): void {
        this.clientPlayer = new Player(this, 100, 100, this.connection.clientId);
        this.add.existing(this.clientPlayer);
        this.players.push(this.clientPlayer);

        this.clientPlayer.setRotation(Math.PI);

        this.cameras.main.startFollow(this.clientPlayer);
        this.cameras.main.setDeadzone(100,100);
    }

    update(): void {

    }

}