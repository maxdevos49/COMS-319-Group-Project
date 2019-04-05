import {Player} from "../objects/Player.js";
import {GameConnection} from "../GameConnection.js";
import {GameObject} from "../objects/GameObject.js";
import {PositionUpdate} from "../../models/game/PositionUpdate.js";
import {PlayerPositionUpdate} from "../../models/game/PlayerPositionUpdate.js";
import {PlayerUpdate} from "../../models/games/PlayerUpdate.js";
import { PlayerMoveUpdate } from "../../models/game/PlayerMoveUpdate.js";


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
        this.clientPlayer = new Player(this, 0, 0, this.connection.clientId);
        this.add.existing(this.clientPlayer);
        this.objects.set(this.clientPlayer.id, this.clientPlayer);

        this.clientPlayer.setRotation(Math.PI);

       // this.cameras.main.startFollow(this.clientPlayer);
       // this.cameras.main.setDeadzone(100,100);
    }

    update(): void {
        // Check for new players
        let newPlayerUpdatesToRemove: PlayerUpdate[] = [];
        this.connection.newPlayersIds.forEach((newPlayerUpdate: PlayerUpdate) => {
           // Only use the update if a position update has been sent for it already
           let positionUpdateForPlayer: PositionUpdate = this.connection.positionUpdates.popUpdate(newPlayerUpdate.id);
           if (positionUpdateForPlayer != null) {
               // Add player to game
               let newPlayer: Player = new Player(this, 0, 0, newPlayerUpdate.id);
               this.add.existing(newPlayer);
               this.objects.set(newPlayer.id, newPlayer);
               // Apply the position update so the player is placed correctly
               newPlayer.applyUpdate(positionUpdateForPlayer as PlayerPositionUpdate);
               newPlayerUpdatesToRemove.push(newPlayerUpdate);
           }
        });
        newPlayerUpdatesToRemove.forEach((toRemove: PlayerUpdate) => {
           this.connection.newPlayersIds.splice(this.connection.newPlayersIds.indexOf(toRemove), 1);
        });

        // Apply updates
        this.objects.forEach((object: GameObject, id: string) => {
            // Apply updates from server
            let tempUpdate: PositionUpdate = this.connection.positionUpdates.popUpdate(id);
            if (tempUpdate != null) {
                object.applyUpdate(tempUpdate);
            }
            // Send move updates to server
            if (object instanceof Player) {
                const player: Player = object as Player;
                if (!player.moveUpdate) {
                    this.connection.sendMove(player.moveUpdate);
                }
            }
        });

        
    }

}