import {Player} from "../objects/Player";
import {GameConnection} from "../GameConnection";

export class GameScene extends Phaser.Scene {
    /**
     * The connection to the server
     */
    connection: GameConnection;
    /**
     * The array of players including the player themselves
     */
    private players: Player[];

    constructor() {
        super({
            key: "GameScene"
        });

        this.connection = this.registry.get("connection");

        this.players = [];
        this.players.push(new Player(this, 0, 0, this.connection.clientId));
    }
}