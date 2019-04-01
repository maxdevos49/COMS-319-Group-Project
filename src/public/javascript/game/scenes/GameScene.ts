import {Player} from "../objects/Player.js";
import {GameConnection} from "../GameConnection.js";
import {GameObject} from "../objects/GameObject.js";
import {PositionUpdate} from "../../models/game/PositionUpdate.js";
import {PlayerActionState, PlayerPositionUpdate} from "../../models/game/PlayerPositionUpdate.js";

export class GameScene extends Phaser.Scene {
    /**
     * The connection to the server
     */
    connection: GameConnection;
    /**
     * The map from id to game object that contains all game objects in the game
     */
    private objects: Map<string, GameObject>;
    /**
     * A reference to the player that this client is playing
     */
    private clientPlayer: Player;
    constructor() {
        super({
            key: "GameScene"
        });

        this.objects = new Map<string, GameObject>();
    }

    init(connection: GameConnection): void {
        this.connection = connection;
    }

    create(): void {
        this.clientPlayer = new Player(this, 100, 100, this.connection.clientId);
        this.add.existing(this.clientPlayer);
        this.objects.set(this.clientPlayer.id, this.clientPlayer);

        this.clientPlayer.setRotation(Math.PI);

        this.cameras.main.startFollow(this.clientPlayer);
        this.cameras.main.setDeadzone(100,100);
    }

    update(): void {
        this.objects.forEach((object: GameObject, id: string) => {
           let tempUpdate: PositionUpdate = this.connection.positionUpdates.popUpdate(id);
           if (tempUpdate != null) {
               object.applyUpdate(tempUpdate);
           }
        });
    }

}